import {
  buildEmailBody,
  buildMimeMessage,
  readGmailConfig,
  sendWithGmail,
} from "@/lib/contact/email";
import {
  getContactMessages,
  resolveLocale,
  type ContactMessages,
} from "@/lib/contact/messages";
import {
  consumeRateLimit,
  createFormToken,
  isSameOrigin,
  rateLimitKey,
  verifyFormToken,
} from "@/lib/contact/spam";
import {
  validateContactInput,
  type ContactField,
  type ContactFieldErrors,
} from "@/lib/contact/validation";

const MAX_BODY_BYTES = 32 * 1024;

function reply(status: number, body: object, headers?: HeadersInit): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function localizeFieldErrors(
  errors: ContactFieldErrors,
  messages: ContactMessages,
): Partial<Record<ContactField, string>> {
  return Object.fromEntries(
    Object.entries(errors).map(([field, code]) => {
      const fieldMessages = messages.errors[field as ContactField] as Record<
        string,
        string
      >;
      return [field, fieldMessages[code]];
    }),
  );
}

function failedReply(status: number, messages: ContactMessages): Response {
  return reply(status, {
    status: "failed",
    message: messages.api.failed,
    alternatives: {
      email: process.env.CONTACT_PUBLIC_EMAIL || null,
      whatsapp: process.env.CONTACT_WHATSAPP_URL || null,
    },
  });
}

export function GET(): Response {
  const secret = process.env.CONTACT_FORM_SECRET;
  if (!secret) {
    console.error("[contact] CONTACT_FORM_SECRET is not set");
    return reply(503, { status: "unavailable" });
  }
  return reply(200, { formToken: createFormToken(secret) });
}

export async function POST(request: Request): Promise<Response> {
  const defaultMessages = getContactMessages(resolveLocale(undefined));

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return reply(413, {
      status: "rejected",
      message: defaultMessages.api.rejected,
    });
  }

  let body: Record<string, unknown>;
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) {
      return reply(413, {
        status: "rejected",
        message: defaultMessages.api.rejected,
      });
    }
    const parsed: unknown = JSON.parse(rawBody);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new TypeError("Body is not a JSON object");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return reply(400, {
      status: "rejected",
      message: defaultMessages.api.rejected,
    });
  }

  const locale = resolveLocale(body.locale);
  const messages = getContactMessages(locale);

  if (!isSameOrigin(request.headers)) {
    return reply(403, { status: "rejected", message: messages.api.rejected });
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return reply(200, { status: "sent", message: messages.api.sent });
  }

  const secret = process.env.CONTACT_FORM_SECRET;
  if (!secret) {
    console.error("[contact] CONTACT_FORM_SECRET is not set");
    return failedReply(503, messages);
  }

  const tokenStatus = verifyFormToken(body.formToken, secret);
  if (tokenStatus === "expired") {
    return reply(403, { status: "expired", message: messages.api.expired });
  }
  if (tokenStatus !== "ok") {
    return reply(403, { status: "rejected", message: messages.api.rejected });
  }

  const validation = validateContactInput(body);
  if (!validation.ok) {
    return reply(422, {
      status: "invalid",
      message: messages.api.invalid,
      fields: localizeFieldErrors(validation.errors, messages),
    });
  }

  const gmailConfig = readGmailConfig();
  if (!gmailConfig) {
    console.error("[contact] Gmail environment variables are not complete");
    return failedReply(503, messages);
  }

  const retryAfter = consumeRateLimit(rateLimitKey(request.headers, secret));
  if (retryAfter !== null) {
    return reply(
      429,
      { status: "rateLimited", message: messages.api.rateLimited },
      { "Retry-After": String(retryAfter) },
    );
  }

  const consentAt = new Date();

  try {
    await sendWithGmail(
      buildMimeMessage(
        validation.data,
        gmailConfig.recipients,
        buildEmailBody(validation.data, locale, consentAt),
      ),
      gmailConfig,
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    console.error(`[contact] Sending failed: ${reason}`);
    return failedReply(502, messages);
  }

  return reply(200, { status: "sent", message: messages.api.sent });
}

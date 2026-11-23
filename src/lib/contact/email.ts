import type { ContactSubmission } from "./validation";

const GMAIL_TIMEOUT_MS = 2_500;
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

export type GmailConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  recipients: string[];
};

export function readGmailConfig(): GmailConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const recipients = (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (!clientId || !clientSecret || !refreshToken || recipients.length === 0) {
    return null;
  }
  return { clientId, clientSecret, refreshToken, recipients };
}

function encodeHeaderText(text: string): string {
  const chunks: string[] = [];
  let current = "";
  for (const character of text) {
    if (Buffer.byteLength(current + character) > 42) {
      chunks.push(current);
      current = "";
    }
    current += character;
  }
  chunks.push(current);

  return chunks
    .map(
      (chunk) => `=?UTF-8?B?${Buffer.from(chunk).toString("base64")}?=`,
    )
    .join("\r\n ");
}

function formatConsentTime(consentAt: Date): string {
  const jakartaTime = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "long",
    timeStyle: "medium",
  }).format(consentAt);
  return `${jakartaTime} WIB (${consentAt.toISOString()})`;
}

export function buildEmailBody(
  submission: ContactSubmission,
  locale: string,
  consentAt: Date,
): string {
  return [
    "Pesan baru dari formulir Kontak website VeloCT.",
    "",
    `Nama: ${submission.name}`,
    `Email: ${submission.email}`,
    `WhatsApp: ${submission.phone ?? "-"}`,
    `Organisasi: ${submission.organization}`,
    `Bahasa halaman: ${locale.toUpperCase()}`,
    "",
    "Pesan:",
    submission.message,
    "",
    "---",
    "Persetujuan Kebijakan Privasi: Ya",
    `Waktu persetujuan: ${formatConsentTime(consentAt)}`,
    "",
    "Balas email ini untuk menjawab pengunjung, paling lambat 3 hari kerja.",
  ].join("\n");
}

export function buildMimeMessage(
  submission: ContactSubmission,
  recipients: string[],
  body: string,
): string {
  const encodedBody = Buffer.from(body.replace(/\n/g, "\r\n"))
    .toString("base64")
    .replace(/.{1,76}/g, "$&\r\n");

  return [
    `To: ${recipients.join(", ")}`,
    `Reply-To: ${submission.email}`,
    `Subject: ${encodeHeaderText(`[Website VeloCT] Pesan baru dari ${submission.name}`)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    encodedBody,
  ].join("\r\n");
}

export async function sendWithGmail(
  mimeMessage: string,
  config: GmailConfig,
): Promise<void> {
  const signal = AbortSignal.timeout(GMAIL_TIMEOUT_MS);

  const tokenResponse = await fetch(TOKEN_URL, {
    method: "POST",
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: "refresh_token",
    }),
    signal,
  });
  if (!tokenResponse.ok) {
    throw new Error(`Gmail token request failed: ${tokenResponse.status}`);
  }
  const { access_token: accessToken } = (await tokenResponse.json()) as {
    access_token: string;
  };

  const sendResponse = await fetch(SEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw: Buffer.from(mimeMessage).toString("base64url"),
    }),
    signal,
  });
  if (!sendResponse.ok) {
    throw new Error(`Gmail send request failed: ${sendResponse.status}`);
  }
}

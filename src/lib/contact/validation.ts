export type ContactSubmission = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

export type ContactField = keyof ContactSubmission | "privacyConsent";
export type ContactErrorCode = "required" | "tooLong" | "invalid";
export type ContactFieldErrors = Partial<Record<ContactField, ContactErrorCode>>;

export type ValidationResult =
  | { ok: true; data: ContactSubmission }
  | { ok: false; errors: ContactFieldErrors };

const MAX_LENGTH = { name: 100, email: 254, organization: 150, message: 5000 };

const CONTROL_CHARS = /\p{Cc}/u;
const MESSAGE_CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/;
const EMAIL = /^[^\s@<>()",;:\\[\]]+@[^\s@<>()",;:\\[\]]+\.[^\s@<>()",;:\\[\].]+$/;

function checkField(
  value: unknown,
  maxLength: number,
  isValid: (text: string) => boolean,
): { text: string; error?: ContactErrorCode } {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return { text, error: "required" };
  if (text.length > maxLength) return { text, error: "tooLong" };
  if (!isValid(text)) return { text, error: "invalid" };
  return { text };
}

export function validateContactInput(
  input: Record<string, unknown>,
): ValidationResult {
  const isSingleLine = (text: string) => !CONTROL_CHARS.test(text);

  const name = checkField(input.name, MAX_LENGTH.name, isSingleLine);
  const email = checkField(input.email, MAX_LENGTH.email, (text) =>
    EMAIL.test(text),
  );
  const organization = checkField(
    input.organization,
    MAX_LENGTH.organization,
    isSingleLine,
  );
  const message = checkField(
    input.message,
    MAX_LENGTH.message,
    (text) => !MESSAGE_CONTROL_CHARS.test(text),
  );

  const errors: ContactFieldErrors = {};
  if (name.error) errors.name = name.error;
  if (email.error) errors.email = email.error;
  if (organization.error) errors.organization = organization.error;
  if (message.error) errors.message = message.error;
  if (input.privacyConsent !== true) errors.privacyConsent = "required";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name: name.text,
      email: email.text,
      organization: organization.text,
      message: message.text.replace(/\r\n?/g, "\n"),
    },
  };
}

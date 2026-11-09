import en from "../../../messages/en/contact.json";
import id from "../../../messages/id/contact.json";

const messages = { id, en };

export type ContactLocale = keyof typeof messages;
export type ContactMessages = (typeof messages)[ContactLocale];

export function resolveLocale(value: unknown): ContactLocale {
  return value === "en" ? "en" : "id";
}

export function getContactMessages(locale: ContactLocale): ContactMessages {
  return messages[locale];
}

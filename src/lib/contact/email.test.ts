import { describe, expect, it } from "vitest";

import { buildEmailBody, buildMimeMessage } from "./email";

const submission = {
  name: "Budi Contoh",
  email: "budi@contoh.test",
  organization: "PT Contoh",
  message: "Baris pertama\nBaris kedua é",
};
const consentAt = new Date("2026-11-09T08:30:15.000Z");

function decodeSubject(mime: string): string {
  const header = mime.split("\r\n\r\n")[0];
  const subject = header.match(/^Subject: ([\s\S]*?)\r\nMIME-Version/m)?.[1];
  return Buffer.concat(
    [...(subject ?? "").matchAll(/=\?UTF-8\?B\?([^?]+)\?=/g)].map((match) =>
      Buffer.from(match[1], "base64"),
    ),
  ).toString();
}

describe("buildEmailBody", () => {
  it("contains every form field and the privacy consent mark and time", () => {
    const body = buildEmailBody(submission, "id", consentAt);
    expect(body).toContain("Nama: Budi Contoh");
    expect(body).toContain("Email: budi@contoh.test");
    expect(body).toContain("Organisasi: PT Contoh");
    expect(body).toContain("Baris pertama\nBaris kedua é");
    expect(body).toContain("Persetujuan Kebijakan Privasi: Ya");
    expect(body).toContain("9 November 2026");
    expect(body).toContain("15.30.15 WIB");
    expect(body).toContain("2026-11-09T08:30:15.000Z");
  });
});

describe("buildMimeMessage", () => {
  const recipients = ["resmi@contoh.test", "sales@contoh.test"];

  it("addresses all recipients and replies to the visitor", () => {
    const mime = buildMimeMessage(submission, recipients, "isi");
    expect(mime).toContain("To: resmi@contoh.test, sales@contoh.test\r\n");
    expect(mime).toContain("Reply-To: budi@contoh.test\r\n");
  });

  it("round trips a non ASCII body through base64", () => {
    const mime = buildMimeMessage(submission, recipients, "Halo é\nDunia 🙂");
    const encoded = mime.split("\r\n\r\n")[1].replace(/\r\n/g, "");
    expect(Buffer.from(encoded, "base64").toString()).toBe(
      "Halo é\r\nDunia 🙂",
    );
  });

  it("keeps long non ASCII subjects valid without splitting characters", () => {
    const name = "Budi 🙂 é".repeat(12);
    const mime = buildMimeMessage({ ...submission, name }, recipients, "isi");
    expect(decodeSubject(mime)).toBe(
      `[Website VeloCT] Pesan baru dari ${name}`,
    );
    for (const line of mime.split("\r\n\r\n")[0].split("\r\n")) {
      expect(line.length).toBeLessThanOrEqual(78);
    }
  });

  it("wraps long bodies at 76 characters", () => {
    const mime = buildMimeMessage(submission, recipients, "a".repeat(500));
    for (const line of mime.split("\r\n\r\n")[1].split("\r\n")) {
      expect(line.length).toBeLessThanOrEqual(76);
    }
  });
});

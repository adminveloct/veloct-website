import { describe, expect, it } from "vitest";

import { validateContactInput } from "./validation";

const valid = {
  name: "Budi Contoh",
  email: "budi@contoh.test",
  organization: "PT Contoh",
  message: "Halo,\r\nsaya ingin bertanya.",
  privacyConsent: true,
};

describe("validateContactInput", () => {
  it("accepts valid input, trims it and normalizes line breaks", () => {
    const result = validateContactInput({ ...valid, name: "  Budi Contoh " });
    expect(result).toEqual({
      ok: true,
      data: {
        name: "Budi Contoh",
        email: "budi@contoh.test",
        organization: "PT Contoh",
        phone: null,
        message: "Halo,\nsaya ingin bertanya.",
      },
    });
  });

  it("reports every empty field at once", () => {
    expect(validateContactInput({})).toEqual({
      ok: false,
      errors: {
        name: "required",
        email: "required",
        organization: "required",
        message: "required",
        privacyConsent: "required",
      },
    });
  });

  it.each([true, 1, "true", false, undefined])(
    "only counts literal true as consent (%s)",
    (privacyConsent) => {
      const result = validateContactInput({ ...valid, privacyConsent });
      expect(result.ok).toBe(privacyConsent === true);
    },
  );

  it.each([
    "tanpa-at",
    "a@b",
    "a b@contoh.test",
    "a@contoh.test\r\nBcc: x@contoh.test",
    "<a@contoh.test>",
    "a@contoh.test, b@contoh.test",
  ])("rejects email %j", (email) => {
    const result = validateContactInput({ ...valid, email });
    expect(result).toEqual({ ok: false, errors: { email: "invalid" } });
  });

  it("rejects line breaks in single line fields to block header injection", () => {
    const result = validateContactInput({
      ...valid,
      name: "Budi\r\nBcc: x@contoh.test",
      organization: "PT\nContoh",
    });
    expect(result).toEqual({
      ok: false,
      errors: { name: "invalid", organization: "invalid" },
    });
  });

  it("enforces maximum lengths", () => {
    const result = validateContactInput({
      ...valid,
      name: "a".repeat(101),
      organization: "a".repeat(151),
      message: "a".repeat(5001),
    });
    expect(result).toEqual({
      ok: false,
      errors: {
        name: "tooLong",
        organization: "tooLong",
        message: "tooLong",
      },
    });
  });

  it("treats non text values as empty", () => {
    const result = validateContactInput({ ...valid, name: { a: 1 } });
    expect(result).toEqual({ ok: false, errors: { name: "required" } });
  });

  describe("phone", () => {
    it.each([undefined, null, "", "   "])("is optional (%j)", (phone) => {
      const result = validateContactInput({ ...valid, phone });
      expect(result.ok && result.data.phone).toBeNull();
    });

    it.each([
      ["081234567890", "081234567890"],
      ["+6281234567890", "+6281234567890"],
      ["0812-3456-7890", "081234567890"],
      [" +62 812 3456 7890 ", "+6281234567890"],
      ["0812345678", "0812345678"],
      ["0812345678901", "0812345678901"],
    ])("accepts %j as %j", (phone, expected) => {
      const result = validateContactInput({ ...valid, phone });
      expect(result.ok && result.data.phone).toBe(expected);
    });

    it.each([
      "6281234567890",
      "81234567890",
      "+6221234567",
      "0211234567",
      "081234567",
      "08123456789012",
      "0812abc4567",
      "(0812) 3456 7890",
      "+62 812 3456 7890\r\nBcc: x@contoh.test",
      81234567890,
    ])("rejects %j", (phone) => {
      const result = validateContactInput({ ...valid, phone });
      expect(result).toEqual({ ok: false, errors: { phone: "invalid" } });
    });
  });
});

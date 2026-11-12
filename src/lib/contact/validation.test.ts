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
});

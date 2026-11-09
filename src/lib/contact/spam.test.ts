import { describe, expect, it } from "vitest";

import {
  consumeRateLimit,
  createFormToken,
  isSameOrigin,
  MIN_FILL_MS,
  RATE_LIMIT_WINDOW_MS,
  TOKEN_TTL_MS,
  verifyFormToken,
} from "./spam";

const SECRET = "rahasia-uji";
const NOW = 1_800_000_000_000;

describe("form token", () => {
  const token = createFormToken(SECRET, NOW);

  it("accepts a token within the allowed time", () => {
    expect(verifyFormToken(token, SECRET, NOW + MIN_FILL_MS)).toBe("ok");
    expect(verifyFormToken(token, SECRET, NOW + TOKEN_TTL_MS)).toBe("ok");
  });

  it("flags a form sent too quickly", () => {
    expect(verifyFormToken(token, SECRET, NOW + MIN_FILL_MS - 1)).toBe(
      "tooFast",
    );
  });

  it("flags an expired token", () => {
    expect(verifyFormToken(token, SECRET, NOW + TOKEN_TTL_MS + 1)).toBe(
      "expired",
    );
  });

  it("rejects a backdated timestamp, since the signature no longer matches", () => {
    const signature = token.split(".")[1];
    const forged = `${NOW - 60_000}.${signature}`;
    expect(verifyFormToken(forged, SECRET, NOW)).toBe("invalid");
  });

  it.each([undefined, 123, "", "abc", "1.2.3", `${NOW}.`, `.${"a".repeat(64)}`])(
    "rejects malformed token %j",
    (value) => {
      expect(verifyFormToken(value, SECRET, NOW)).toBe("invalid");
    },
  );

  it("rejects a token signed with another secret", () => {
    const other = createFormToken("rahasia-lain", NOW);
    expect(verifyFormToken(other, SECRET, NOW + MIN_FILL_MS)).toBe("invalid");
  });
});

describe("isSameOrigin", () => {
  it.each([
    [{ origin: "https://veloct.co.id", host: "veloct.co.id" }, true],
    [
      {
        origin: "https://preview.vercel.app",
        host: "internal",
        "x-forwarded-host": "preview.vercel.app",
      },
      true,
    ],
    [{ origin: "https://jahat.test", host: "veloct.co.id" }, false],
    [{ host: "veloct.co.id" }, false],
    [{ origin: "bukan url", host: "veloct.co.id" }, false],
  ])("%j gives %s", (headers, expected) => {
    expect(isSameOrigin(new Headers(headers))).toBe(expected);
  });
});

describe("consumeRateLimit", () => {
  it("blocks after five attempts and opens again after the window", () => {
    const key = "pengunjung-a";
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(consumeRateLimit(key, NOW)).toBeNull();
    }
    expect(consumeRateLimit(key, NOW)).toBe(RATE_LIMIT_WINDOW_MS / 1_000);
    expect(consumeRateLimit("pengunjung-b", NOW)).toBeNull();
    expect(consumeRateLimit(key, NOW + RATE_LIMIT_WINDOW_MS)).toBeNull();
  });
});

import { createHmac, timingSafeEqual } from "node:crypto";

export const MIN_FILL_MS = 3_000;
export const TOKEN_TTL_MS = 24 * 60 * 60 * 1_000;

export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const DEFAULT_RATE_LIMIT_MAX = 5;

export type TokenStatus = "ok" | "invalid" | "tooFast" | "expired";

function sign(issuedAt: string, secret: string): string {
  return createHmac("sha256", secret).update(issuedAt).digest("hex");
}

export function createFormToken(secret: string, now = Date.now()): string {
  const issuedAt = String(now);
  return `${issuedAt}.${sign(issuedAt, secret)}`;
}

export function verifyFormToken(
  token: unknown,
  secret: string,
  now = Date.now(),
): TokenStatus {
  if (typeof token !== "string") return "invalid";

  const [issuedAt, signature, ...rest] = token.split(".");
  if (rest.length > 0 || !issuedAt || !signature || !/^\d+$/.test(issuedAt)) {
    return "invalid";
  }

  const expected = Buffer.from(sign(issuedAt, secret));
  const received = Buffer.from(signature);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return "invalid";
  }

  const age = now - Number(issuedAt);
  if (age < 0) return "invalid";
  if (age < MIN_FILL_MS) return "tooFast";
  if (age > TOKEN_TTL_MS) return "expired";
  return "ok";
}

export function isSameOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function rateLimitKey(headers: Headers, secret: string): string {
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return createHmac("sha256", secret).update(ip).digest("hex");
}

const attempts = new Map<string, { count: number; resetAt: number }>();

export function consumeRateLimit(key: string, now = Date.now()): number | null {
  for (const [storedKey, entry] of attempts) {
    if (entry.resetAt <= now) attempts.delete(storedKey);
  }

  const parsedMax = Number(process.env.CONTACT_RATE_LIMIT_MAX);
  const max = parsedMax > 0 ? parsedMax : DEFAULT_RATE_LIMIT_MAX;

  const entry = attempts.get(key);
  if (!entry) {
    attempts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }
  if (entry.count >= max) return Math.ceil((entry.resetAt - now) / 1_000);

  entry.count += 1;
  return null;
}

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "./route";

const NOW = new Date("2026-11-09T08:00:00.000Z");
const FILL_TIME_MS = 5_000;

const fetchMock = vi.fn<typeof fetch>();
let visitorCounter = 0;

function gmailAccepts() {
  fetchMock.mockImplementation(async (url) =>
    String(url).includes("oauth2")
      ? Response.json({ access_token: "token-uji" })
      : Response.json({ id: "pesan-1" }),
  );
}

async function getToken(): Promise<string> {
  const response = GET();
  const { formToken } = await response.json();
  vi.setSystemTime(NOW.getTime() + FILL_TIME_MS);
  return formToken;
}

function post(body: unknown, headers: Record<string, string> = {}): Promise<Response> {
  visitorCounter += 1;
  return POST(
    new Request("https://veloct.test/api/contact", {
      method: "POST",
      headers: {
        host: "veloct.test",
        origin: "https://veloct.test",
        "x-forwarded-for": `10.0.0.${visitorCounter}`,
        ...headers,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

async function validBody(overrides: object = {}) {
  return {
    name: "Budi Contoh",
    email: "budi@contoh.test",
    organization: "PT Contoh",
    message: "Halo VeloCT",
    privacyConsent: true,
    locale: "id",
    formToken: await getToken(),
    website: "",
    ...overrides,
  };
}

function sentMime(): string {
  const sendCall = fetchMock.mock.calls.find(([url]) =>
    String(url).includes("messages/send"),
  );
  const { raw } = JSON.parse(String(sendCall?.[1]?.body)) as { raw: string };
  return Buffer.from(raw, "base64url").toString();
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"], now: NOW });
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("CONTACT_FORM_SECRET", "rahasia-uji");
  vi.stubEnv("CONTACT_TO_EMAIL", "resmi@contoh.test, sales@contoh.test");
  vi.stubEnv("GOOGLE_CLIENT_ID", "id-uji");
  vi.stubEnv("GOOGLE_CLIENT_SECRET", "secret-uji");
  vi.stubEnv("GOOGLE_REFRESH_TOKEN", "refresh-uji");
  vi.stubEnv("CONTACT_PUBLIC_EMAIL", "halo@contoh.test");
  vi.stubEnv("CONTACT_WHATSAPP_URL", "https://wa.me/620000");
  vi.stubEnv("CONTACT_RATE_LIMIT_MAX", "");
  vi.spyOn(console, "error").mockImplementation(() => {});
  fetchMock.mockReset();
  gmailAccepts();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("successful send", () => {
  it("emails the form and the consent time, and promises a reply in 3 days", async () => {
    const response = await post(await validBody());

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.status).toBe("sent");
    expect(json.message).toContain(
      "Kami akan membalas pesan Anda paling lambat 3 hari kerja.",
    );

    const mime = sentMime();
    expect(mime).toContain("To: resmi@contoh.test, sales@contoh.test");
    expect(mime).toContain("Reply-To: budi@contoh.test");

    const encodedBody = mime.split("\r\n\r\n")[1].replace(/\r\n/g, "");
    const text = Buffer.from(encodedBody, "base64").toString();
    expect(text).toContain("Halo VeloCT");
    expect(text).toContain("WhatsApp: -");
    expect(text).toContain("Persetujuan Kebijakan Privasi: Ya");
    expect(text).toContain("2026-11-09T08:00:05.000Z");
  });

  it("includes an optional phone number in the email, without separators", async () => {
    const response = await post(await validBody({ phone: "+62 812-3456-7890" }));

    expect(response.status).toBe(200);
    const encodedBody = sentMime().split("\r\n\r\n")[1].replace(/\r\n/g, "");
    expect(Buffer.from(encodedBody, "base64").toString()).toContain(
      "WhatsApp: +6281234567890",
    );
  });

  it("answers in English for the English page", async () => {
    const response = await post(await validBody({ locale: "en" }));
    expect((await response.json()).message).toContain(
      "We will reply to your message within 3 working days.",
    );
  });
});

describe("invalid input", () => {
  it("marks each wrong field in the visitor's language and sends nothing", async () => {
    const response = await post(
      await validBody({
        name: "",
        email: "salah",
        privacyConsent: false,
        locale: "en",
      }),
    );

    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      status: "invalid",
      message: "Please check the highlighted fields.",
      fields: {
        name: "Name is required.",
        email: "Email format is not valid.",
        privacyConsent: "Please accept the Privacy Policy to send your message.",
      },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a wrong phone format in the visitor's language", async () => {
    const response = await post(await validBody({ phone: "021-1234567" }));

    expect(response.status).toBe(422);
    expect((await response.json()).fields).toEqual({
      phone: "Nomor WhatsApp harus diawali 08 atau +62, contoh 081234567890.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(["bukan json", "[]", "null"])("rejects body %j", async (body) => {
    expect((await post(body)).status).toBe(400);
  });

  it("rejects an oversized body", async () => {
    const response = await post(await validBody({ message: "a".repeat(40_000) }));
    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("failed send", () => {
  it.each([
    ["token request refused", [401, 200]],
    ["send request refused", [200, 500]],
  ])("offers email and WhatsApp when %s", async (_, [tokenCode, sendCode]) => {
    fetchMock.mockImplementation(async (url) =>
      String(url).includes("oauth2")
        ? Response.json({ access_token: "t" }, { status: tokenCode })
        : Response.json({}, { status: sendCode }),
    );

    const response = await post(await validBody());

    expect(response.status).toBe(502);
    const json = await response.json();
    expect(json.status).toBe("failed");
    expect(json.alternatives).toEqual({
      email: "halo@contoh.test",
      whatsapp: "https://wa.me/620000",
    });
  });

  it("handles a network failure without logging the visitor's data", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    const response = await post(await validBody());

    expect(response.status).toBe(502);
    const logged = JSON.stringify(vi.mocked(console.error).mock.calls);
    expect(logged).not.toContain("budi@contoh.test");
    expect(logged).not.toContain("Halo VeloCT");
  });

  it("fails safely when Gmail is not configured", async () => {
    vi.stubEnv("GOOGLE_REFRESH_TOKEN", "");
    const response = await post(await validBody());
    expect(response.status).toBe(503);
    expect((await response.json()).status).toBe("failed");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("spam protection", () => {
  it("pretends to succeed for a filled honeypot, without sending", async () => {
    const response = await post(await validBody({ website: "https://spam.test" }));
    expect(response.status).toBe(200);
    expect((await response.json()).status).toBe("sent");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a foreign origin", async () => {
    const response = await post(await validBody(), {
      origin: "https://jahat.test",
    });
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a missing token", async () => {
    const response = await post(await validBody({ formToken: undefined }));
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a form sent right after opening", async () => {
    const body = await validBody();
    body.formToken = (await GET().json()).formToken;

    const response = await post(body);

    expect(response.status).toBe(403);
    expect((await response.json()).status).toBe("rejected");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("tells the form to get a new token when the old one has expired", async () => {
    const body = await validBody();
    vi.setSystemTime(NOW.getTime() + 25 * 60 * 60 * 1_000);
    const response = await post(body);
    expect(response.status).toBe(403);
    expect((await response.json()).status).toBe("expired");
  });

  it("limits repeated sends from one visitor", async () => {
    const headers = { "x-forwarded-for": "10.9.9.9" };
    const body = await validBody();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect((await post(body, headers)).status).toBe(200);
    }
    const blocked = await post(body, headers);
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("retry-after")).toBe("600");
  });
});

describe("GET", () => {
  it("issues an uncached token", async () => {
    const response = GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect((await response.json()).formToken).toMatch(/^\d+\.[0-9a-f]{64}$/);
  });

  it("is unavailable without a secret", () => {
    vi.stubEnv("CONTACT_FORM_SECRET", "");
    expect(GET().status).toBe(503);
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

import robots from "./robots";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("robots", () => {
  it.each(["https://veloct.co.id", "https://veloct.co.id/"])(
    "allows every crawler and points to the sitemap on production (%s)",
    (siteUrl) => {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
      expect(robots()).toEqual({
        rules: { userAgent: "*", allow: "/" },
        sitemap: "https://veloct.co.id/sitemap.xml",
      });
    },
  );

  it.each([
    "https://staging.veloct.co.id",
    "https://veloct-website-git-main.vercel.app",
    "http://veloct.co.id",
    "https://www.veloct.co.id",
    "http://localhost:3000",
    "",
  ])("blocks every crawler elsewhere (%j)", (siteUrl) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("blocks every crawler when the site URL is not set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });
});

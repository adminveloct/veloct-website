import { headers } from "next/headers";
import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { getSlug } from "@/i18n/pages";

export default async function GlobalNotFound() {
  const headerStore = await headers();
  const requestedLocale = headerStore.get("x-next-intl-locale");
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const messages = (
    await import(`../../messages/${locale}/common.json`)
  ).default;
  const notFound = messages.notFound;

  const homeHref = `/${locale}`;
  const contactHref = `/${locale}/${getSlug("contact", locale)}`;

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${notFound.title} | VeloCT`}</title>
        <meta name="robots" content="noindex" />
        <style>{`
          *,
          *::before,
          *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI",
              Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #ffffff;
            color: #18181b;
          }
          main {
            max-width: 36rem;
            text-align: center;
          }
          .status {
            font-size: 0.875rem;
            font-weight: 600;
            letter-spacing: 0.1em;
            color: #71717a;
          }
          h1 {
            margin-top: 0.75rem;
            font-size: 2.25rem;
            font-weight: 700;
            line-height: 1.15;
            letter-spacing: -0.02em;
          }
          p {
            margin-top: 1rem;
            font-size: 1.125rem;
            line-height: 1.6;
            color: #52525b;
          }
          nav {
            margin-top: 2rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            justify-content: center;
          }
          a {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            font-size: 0.95rem;
            font-weight: 600;
            text-decoration: none;
            transition: background-color 0.15s ease,
              border-color 0.15s ease;
          }
          a.primary {
            background: #18181b;
            color: #ffffff;
          }
          a.primary:hover {
            background: #27272a;
          }
          a.secondary {
            background: #ffffff;
            color: #18181b;
            border: 1px solid #d4d4d8;
          }
          a.secondary:hover {
            background: #f4f4f5;
          }
          a:focus-visible {
            outline: 2px solid #18181b;
            outline-offset: 2px;
          }
          @media (prefers-color-scheme: dark) {
            body {
              background: #09090b;
              color: #fafafa;
            }
            p {
              color: #a1a1aa;
            }
            a.primary {
              background: #fafafa;
              color: #18181b;
            }
            a.primary:hover {
              background: #e4e4e7;
            }
            a.secondary {
              background: transparent;
              color: #fafafa;
              border-color: #3f3f46;
            }
            a.secondary:hover {
              background: #27272a;
            }
            a:focus-visible {
              outline-color: #fafafa;
            }
          }
        `}</style>
      </head>
      <body>
        <main>
          <p className="status">404</p>
          <h1>{notFound.title}</h1>
          <p>{notFound.description}</p>
          <nav>
            <a className="primary" href={homeHref}>
              {notFound.backHome}
            </a>
            <a className="secondary" href={contactHref}>
              {notFound.goContact}
            </a>
          </nav>
        </main>
      </body>
    </html>
  );
}

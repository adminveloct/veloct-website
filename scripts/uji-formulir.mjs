// Uji formulir Kontak (W-24): NF-W-02 kiriman sah dan NF-W-06 spam skrip.
// Jalankan dari akar repo: node scripts/uji-formulir.mjs <url-preview> [--jumlah=100]
// Token bypass Vercel dibaca dari .env.local: VERCEL_AUTOMATION_BYPASS_SECRET=<token>
import { existsSync, writeFileSync } from "node:fs";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const base = process.argv[2]?.replace(/\/+$/, "");
if (!base?.startsWith("http")) {
  console.error("Pemakaian: node scripts/uji-formulir.mjs <url-preview> [--jumlah=100]");
  process.exit(1);
}
const total = Number(process.argv.find((arg) => arg.startsWith("--jumlah="))?.split("=")[1] ?? 100);
const api = `${base}/api/contact`;
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const bypass = bypassSecret ? { "x-vercel-protection-bypass": bypassSecret } : {};
if (!bypassSecret) console.warn("Peringatan: VERCEL_AUTOMATION_BYPASS_SECRET tidak ada di .env.local\n");

const tag = Math.random().toString(36).slice(2, 8);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const countBy = (rows) => rows.reduce((acc, r) => ({ ...acc, [r.http]: (acc[r.http] ?? 0) + 1 }), {});

async function getToken() {
  const response = await fetch(api, { headers: bypass, signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`GET ${api} gagal: HTTP ${response.status}`);
  return (await response.json()).formToken;
}

async function post(body, withOrigin = true) {
  const headers = { "Content-Type": "application/json", ...bypass, ...(withOrigin && { Origin: new URL(base).origin }) };
  try {
    const response = await fetch(api, { method: "POST", headers, body: JSON.stringify(body), signal: AbortSignal.timeout(10_000) });
    const json = await response.json().catch(() => ({}));
    return { http: response.status, status: json.status ?? "-" };
  } catch (error) {
    return { http: 0, status: error.name };
  }
}

const form = (name, formToken, extra = {}) => ({
  name,
  email: "penguji@contoh.test",
  organization: "Uji W-24",
  message: `${name}\nKiriman uji otomatis W-24. Abaikan pesan ini.`,
  privacyConsent: true,
  locale: "id",
  formToken,
  website: "",
  ...extra,
});

const startedAt = new Date();
console.log(`URL: ${base}\nPenanda: ${tag}\n`);

// Token di bawah 3 detik ditolak (MIN_FILL_MS), jadi setiap kiriman sah memakai token baru dan jeda 3,5 detik.
const valid = [];
for (let i = 1; i <= total; i++) {
  const token = await getToken();
  await wait(3_500);
  valid.push({ no: i, ...(await post(form(`Uji W24 ${tag} sah ${String(i).padStart(3, "0")}`, token))) });
  process.stdout.write(`\rKiriman sah ${i}/${total}: HTTP ${valid.at(-1).http}   `);
}
console.log("\n");

const perKind = Math.ceil(total / 5);
const spamToken = await getToken();
await wait(3_500);
const kinds = {
  "tanpa token": (name) => post(form(name, undefined)),
  "token palsu": (name) => post(form(name, `${Date.now() - 60_000}.${"a".repeat(64)}`)),
  "honeypot terisi": (name) => post(form(name, spamToken, { website: "https://spam.contoh.test" })),
  "tanpa Origin": (name) => post(form(name, spamToken), false),
  "terlalu cepat": async (name) => post(form(name, await getToken())),
};
const spam = [];
for (const [kind, attack] of Object.entries(kinds)) {
  for (let i = 1; i <= perKind; i++) {
    spam.push({ kind, ...(await attack(`Uji W24 ${tag} spam ${kind} ${i}`)) });
  }
  console.log(`Spam ${kind}: ${JSON.stringify(countBy(spam.filter((r) => r.kind === kind)))}`);
}

const failed = valid.filter((r) => r.http !== 200);
writeFileSync(`hasil-w24-${tag}.csv`, ["jenis,no,http,status", ...valid.map((r) => `sah,${r.no},${r.http},${r.status}`), ...spam.map((r, i) => `spam ${r.kind},${i + 1},${r.http},${r.status}`)].join("\n"));

const wib = (date) => date.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
console.log(`
---- salin ke issue W-24, lalu isi angka dari Gmail ----

## Hasil uji formulir Kontak

- URL preview: ${base}
- Waktu uji: ${wib(startedAt)} sampai ${wib(new Date())} WIB
- Penanda uji: \`${tag}\`

| | Jumlah |
|---|---|
| Kiriman sah terkirim | ${valid.length} |
| Sampai ke kotak masuk | ISI DARI GMAIL (target minimal 98) |
| Gagal | ${failed.length}${failed.length ? ` (kode respons: ${JSON.stringify(countBy(failed))})` : ""} |
| Kiriman spam | ${spam.length} |
| Spam tertahan | ISI: ${spam.length} dikurangi jumlah spam di Gmail (target ${spam.length}) |

Kode respons spam per jenis:
${Object.keys(kinds).map((kind) => `- ${kind}: ${JSON.stringify(countBy(spam.filter((r) => r.kind === kind)))}`).join("\n")}

Catatan: spam "honeypot terisi" memang dijawab 200 agar bot tertipu, tetapi email tidak dikirim.

---- cari di Gmail (termasuk folder Spam) ----
Sah:  in:anywhere "${tag}" sah
Spam: in:anywhere "${tag}" spam
Data per kiriman: hasil-w24-${tag}.csv (jangan di-commit)`);

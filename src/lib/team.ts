import fs from "node:fs";
import path from "node:path";

export type TeamMember = {
  id: string;
  badge: string;
  name: string;
  role: string;
  skills: string;
  bio: string;
  certifications: string[];
  linkedin: string;
};

export type TeamData = {
  teamLead: TeamMember;
  teamMembers: TeamMember[];
};

const BADGE_MAP: Record<string, { id: string; en: string }> = {
  "ivan-sudirman": { id: "Bisnis & Pemerintah", en: "Business & Gov" },
  "azka-nurun-ala": { id: "Software & Cloud", en: "Software & Cloud" },
  "rizki-mahasari": { id: "Proses Bisnis", en: "Business Process" },
  daffa: { id: "Data & AI", en: "Data & AI" },
  "asyifa-nurul-shafira": { id: "AI & UI/UX", en: "AI & UI/UX" },
  "husnia-munzayana": { id: "Cloud Engineer", en: "Cloud Engineer" },
  "fauzan-rajwa-dhavansyah": { id: "Cloud & Dokumentasi", en: "Cloud & Docs" },
};

const HIERARCHY_ORDER: Record<string, number> = {
  "ivan-sudirman": 0,
  "azka-nurun-ala": 1,
  "rizki-mahasari": 2,
  daffa: 3,
  "asyifa-nurul-shafira": 4,
  "husnia-munzayana": 5,
  "fauzan-rajwa-dhavansyah": 6,
};

// Fallback translations if English bio is empty in CSV
const BIO_EN_FALLBACK: Record<string, string> = {
  "ivan-sudirman": "Continuously learning and innovating.",
};

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentField);
        currentField = "";
      } else if (char === "\r") {
        if (nextChar === "\n") {
          i++;
        }
        currentRow.push(currentField);
        currentField = "";
        rows.push(currentRow);
        currentRow = [];
      } else if (char === "\n") {
        currentRow.push(currentField);
        currentField = "";
        rows.push(currentRow);
        currentRow = [];
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows.filter((r) => r.some((c) => c.trim().length > 0));
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseCertifications(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(/(?:,|\.\s+|\n)/)
    .map((s) => s.trim().replace(/\.+$/, ""))
    .filter((s) => s.length > 0);
}

export function parseTeamCsv(csvText: string, locale: string): TeamData {
  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    throw new Error("CSV data contains no records");
  }

  const isEn = locale === "en";
  const members: TeamMember[] = [];

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = (row[0] || "").trim();
    const roleId = (row[1] || "").trim();
    const roleEn = (row[2] || "").trim();
    const skills = (row[3] || "").trim();
    const bioId = (row[4] || "").trim();
    const bioEn = (row[5] || "").trim();
    const certRaw = (row[6] || "").trim();
    const linkedinRaw = (row[7] || "").trim();
    const consent = (row[8] || "").trim();

    // Check user consent to be displayed on website
    if (!consent.toLowerCase().startsWith("ya")) {
      continue;
    }

    if (!name) continue;

    const id = toSlug(name);
    const role = isEn && roleEn ? roleEn : roleId;
    const bio = isEn
      ? bioEn || BIO_EN_FALLBACK[id] || bioId
      : bioId;

    const badge =
      BADGE_MAP[id]?.[isEn ? "en" : "id"] ||
      skills.split(",")[0].trim().slice(0, 24) ||
      role;

    const linkedin = linkedinRaw
      ? linkedinRaw.startsWith("http")
        ? linkedinRaw
        : `https://${linkedinRaw}`
      : "";

    const certifications = parseCertifications(certRaw);

    members.push({
      id,
      badge,
      name,
      role,
      skills,
      bio,
      certifications,
      linkedin,
    });
  }

  // Sort by corporate hierarchy
  members.sort((a, b) => (HIERARCHY_ORDER[a.id] ?? 99) - (HIERARCHY_ORDER[b.id] ?? 99));

  const teamLead = members[0] || {
    id: "ivan-sudirman",
    badge: isEn ? "Business & Gov" : "Bisnis & Pemerintah",
    name: "Ivan Sudirman",
    role: isEn ? "CEO" : "Direktur Utama",
    skills: "Business and Gov Solution",
    bio: isEn ? "Continuously learning and innovating." : "Terus belajar dan berinovasi.",
    certifications: [],
    linkedin: "",
  };

  const teamMembers = members.slice(1);

  return { teamLead, teamMembers };
}

export function getTeamData(locale: string): TeamData {
  const customPath = path.join(process.cwd(), "src/data/team.csv");
  const defaultPath = path.join(
    process.cwd(),
    "src/data/tim-sementara-20-11.csv",
  );

  const targetPath = fs.existsSync(/*turbopackIgnore: true*/ customPath)
    ? customPath
    : defaultPath;

  if (!fs.existsSync(/*turbopackIgnore: true*/ targetPath)) {
    throw new Error(`Team CSV not found: ${targetPath}`);
  }

  const csvText = fs.readFileSync(/*turbopackIgnore: true*/ targetPath, "utf-8");
  return parseTeamCsv(csvText, locale);
}

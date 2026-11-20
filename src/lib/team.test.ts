import { describe, expect, it } from "vitest";

import {
  getTeamData,
  parseCertifications,
  parseCsv,
  parseTeamCsv,
  toSlug,
} from "./team";

describe("parseCsv", () => {
  it("handles basic fields and quoted fields with commas", () => {
    const csv = 'Name,Role,"Skills, Tools"\nJohn,Engineer,"React, Node"';
    const rows = parseCsv(csv);
    expect(rows).toEqual([
      ["Name", "Role", "Skills, Tools"],
      ["John", "Engineer", "React, Node"],
    ]);
  });

  it("handles escaped quotes and windows line endings", () => {
    const csv = 'Name,Bio\r\nJane,"Says ""Hello"", World!"\r\n';
    const rows = parseCsv(csv);
    expect(rows).toEqual([
      ["Name", "Bio"],
      ["Jane", 'Says "Hello", World!'],
    ]);
  });
});

describe("toSlug", () => {
  it("converts names to clean slugs", () => {
    expect(toSlug("Ivan Sudirman")).toBe("ivan-sudirman");
    expect(toSlug("  Asyifa Nurul Shafira  ")).toBe("asyifa-nurul-shafira");
  });
});

describe("parseCertifications", () => {
  it("parses single, multiple, and empty certifications", () => {
    expect(parseCertifications("")).toEqual([]);
    expect(parseCertifications("AWS Cloud Practitioner (2026)")).toEqual([
      "AWS Cloud Practitioner (2026)",
    ]);
    expect(
      parseCertifications(
        "AWS Cloud Practitioner 2026. AWS AI Practitioner 2026",
      ),
    ).toEqual(["AWS Cloud Practitioner 2026", "AWS AI Practitioner 2026"]);
  });
});

describe("parseTeamCsv", () => {
  const sampleCsv = `Nama tampil,Jabatan (Bahasa Indonesia),Jabatan (Bahasa Inggris),Keahlian utama,Bio singkat (Bahasa Indonesia),Bio singkat (Bahasa Inggris),Sertifikasi,Profil LinkedIn,Izin tampil di website
Ivan Sudirman,Direktur Utama,CEO,Business and Gov Solution,Terus belajar dan berinovasi,,,https://www.linkedin.com/in/ivan-sudirman-a3a9794,"Ya, saya setuju"
Azka Nurun Ala,Direktur Teknik,Technical Director,Software Development,Bio ID,Bio EN,AWS Cloud Practitioner (2026),linkedin.com/in/azka,"Ya, saya setuju"
Rahasia,Hidden Role,Hidden Role,Secret,Bio secret,,,,,Tidak setuju`;

  it("filters out members without consent", () => {
    const { teamLead, teamMembers } = parseTeamCsv(sampleCsv, "id");
    expect(teamLead.name).toBe("Ivan Sudirman");
    expect(teamMembers).toHaveLength(1);
    expect(teamMembers[0].name).toBe("Azka Nurun Ala");
  });

  it("correctly localizes roles and bios for Indonesian locale", () => {
    const { teamLead, teamMembers } = parseTeamCsv(sampleCsv, "id");
    expect(teamLead.role).toBe("Direktur Utama");
    expect(teamLead.bio).toBe("Terus belajar dan berinovasi");
    expect(teamMembers[0].role).toBe("Direktur Teknik");
    expect(teamMembers[0].bio).toBe("Bio ID");
  });

  it("correctly localizes roles and bios for English locale with fallback", () => {
    const { teamLead, teamMembers } = parseTeamCsv(sampleCsv, "en");
    expect(teamLead.role).toBe("CEO");
    expect(teamLead.bio).toBe("Continuously learning and innovating.");
    expect(teamMembers[0].role).toBe("Technical Director");
    expect(teamMembers[0].bio).toBe("Bio EN");
  });
});

describe("getTeamData", () => {
  it("loads and returns team data from the project CSV", () => {
    const idData = getTeamData("id");
    expect(idData.teamLead.name).toBe("Ivan Sudirman");
    expect(idData.teamLead.role).toBe("Direktur Utama");
    expect(idData.teamMembers).toHaveLength(6);
    expect(idData.teamMembers[0].name).toBe("Azka Nurun Ala");

    const enData = getTeamData("en");
    expect(enData.teamLead.role).toBe("CEO");
    expect(enData.teamMembers[0].role).toBe("Technical Director");
  });
});

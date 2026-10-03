import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const SHEETS = "https://connector-gateway.lovable.dev/google_sheets/v4";
const DRIVE_UPLOAD =
  "https://connector-gateway.lovable.dev/google_drive/upload/drive/v3/files";

const FOLDERS = {
  id: "1-I10iC_am4dp0PBLd9Ao_zmVRpW96Kyh",
  arrival: "1NRMeHoqtzaA3c2jBpM6upSRyIBhK9UEP",
  departure: "1fZjlVLeVG7Yi98h816DWSCM26vpC9BXC",
} as const;

const MAX_FILE = 10 * 1024 * 1024;
const MAX_FILES = 5;
const ALLOWED = /^(image\/(jpeg|png|webp|heic|heif)|application\/pdf)$/;
const BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  pdf: "application/pdf",
};

/** Some phones send "image/jpg" or no type at all (often for HEIC), so fall back to the extension. */
function fileType(f: File): string {
  const t = f.type.toLowerCase();
  if (t === "image/jpg" || t === "image/pjpeg") return "image/jpeg";
  if (t && t !== "application/octet-stream") return t;
  return BY_EXT[f.name.split(".").pop()?.toLowerCase() ?? ""] ?? t;
}

const mode = z.enum(["Flight", "Train", "Road", "Other", ""]);
const guestRow = z.object({
  name: z.string().trim().min(2).max(200),
  phone: z.string().trim().max(20).default(""),
  type: z.enum(["adult", "child"]),
});
const schema = z.object({
  name: z.string().trim().min(2).max(200),
  guests: z.coerce.number().int().min(1).max(40),
  guestList: z.string().max(8000).default("[]"),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  attending: z.enum(["yes", "no"]),
  arrivalDate: z.string().max(20).default(""),
  arrivalTime: z.string().max(20).default(""),
  arrivalMode: mode.default(""),
  departureDate: z.string().max(20).default(""),
  departureTime: z.string().max(20).default(""),
  departureMode: mode.default(""),
  message: z.string().trim().max(500).default(""),
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function uploadToDrive(
  file: File,
  folderId: string,
  label: string,
  headers: Record<string, string>,
) {
  const boundary = "hsn" + crypto.randomUUID().replace(/-/g, "");
  const meta = JSON.stringify({
    name: `${label} — ${file.name}`.slice(0, 200),
    parents: [folderId],
  });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const enc = new TextEncoder();
  const head = enc.encode(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${boundary}\r\nContent-Type: ${fileType(file)}\r\n\r\n`,
  );
  const tail = enc.encode(`\r\n--${boundary}--`);
  const body = new Uint8Array(head.length + bytes.length + tail.length);
  body.set(head, 0);
  body.set(bytes, head.length);
  body.set(tail, head.length + bytes.length);

  const res = await fetch(
    `${DRIVE_UPLOAD}?uploadType=multipart&fields=id,webViewLink`,
    {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    },
  );
  if (!res.ok) {
    throw new Error(`Drive upload failed [${res.status}]: ${await res.text()}`);
  }
  const data = (await res.json()) as { id: string; webViewLink?: string };
  return data.webViewLink ?? `https://drive.google.com/file/d/${data.id}/view`;
}

export const Route = createFileRoute("/api/public/rsvp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        const sheetsKey = process.env["GOOGLE_SHEETS_API_KEY"];
        const driveKey = process.env["GOOGLE_DRIVE_API_KEY"];
        const sheetId = process.env["WEDDING_SHEET_ID"];
        if (!apiKey || !sheetsKey || !driveKey || !sheetId) {
          console.error("RSVP not configured");
          return json({ ok: false, error: "RSVP is not available right now." }, 500);
        }

        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return json({ ok: false, error: "Invalid submission." }, 400);
        }

        const fields: Record<string, string> = {};
        for (const [k, v] of form.entries()) {
          if (typeof v === "string") fields[k] = v;
        }
        const parsed = schema.safeParse(fields);
        if (!parsed.success) {
          return json({ ok: false, error: "Please check the form details." }, 400);
        }
        const d = parsed.data;

        let others: z.infer<typeof guestRow>[] = [];
        try {
          const list = z.array(guestRow).max(39).safeParse(JSON.parse(d.guestList));
          if (!list.success) throw new Error("bad guest list");
          others = list.data;
        } catch {
          return json({ ok: false, error: "Please check the guest details." }, 400);
        }
        // Column H keeps one guest per line: "Name – number (Adult|Child)".
        const otherGuests = others
          .map((g) => `${g.name}${g.phone ? ` – ${g.phone}` : ""} (${g.type === "child" ? "Child" : "Adult"})`)
          .join("\n");
        const children = others.filter((g) => g.type === "child").length;

        const groups = {
          id: form.getAll("idFiles"),
          arrival: form.getAll("arrivalFiles"),
          departure: form.getAll("departureFiles"),
        };
        // Guests who are coming must send ID (needed for the resort check-in).
        if (d.attending === "yes" && !groups.id.some((f) => f instanceof File && f.size > 0))
          return json({ ok: false, error: "Please upload the Aadhaar card(s) for your group." }, 400);
        for (const list of Object.values(groups)) {
          const files = list.filter((f): f is File => f instanceof File && f.size > 0);
          if (files.length > MAX_FILES)
            return json({ ok: false, error: "Up to 5 files per section, please." }, 400);
          for (const f of files) {
            if (f.size > MAX_FILE)
              return json({ ok: false, error: `${f.name} is over 10 MB.` }, 400);
            if (!ALLOWED.test(fileType(f)))
              return json({ ok: false, error: `${f.name}: please upload a photo or PDF.` }, 400);
          }
        }

        const driveHeaders = {
          Authorization: `Bearer ${apiKey}`,
          "X-Connection-Api-Key": driveKey,
        };
        const links: Record<keyof typeof groups, string[]> = { id: [], arrival: [], departure: [] };
        let uploadStatus = "No files";
        try {
          for (const key of Object.keys(groups) as (keyof typeof groups)[]) {
            const files = groups[key].filter(
              (f): f is File => f instanceof File && f.size > 0,
            );
            for (const f of files) {
              links[key].push(await uploadToDrive(f, FOLDERS[key], d.name, driveHeaders));
            }
          }
          const total = links.id.length + links.arrival.length + links.departure.length;
          if (total) uploadStatus = `${total} file(s) uploaded`;
        } catch (err) {
          console.error(err);
          uploadStatus = "Upload failed — please follow up with guest";
        }

        const row = [
          new Date().toISOString(),
          d.name,
          "", // column C (spouse) is superseded by the per-guest list in column H
          String(children),
          String(d.guests),
          d.email,
          d.phone,
          otherGuests,
          d.attending === "yes" ? "Yes — attending" : "No — regrets",
          "", // column J (celebrations) is no longer collected; kept so columns K–U don't shift
          d.arrivalDate,
          d.arrivalTime,
          d.arrivalMode,
          d.departureDate,
          d.departureTime,
          d.departureMode,
          links.id.join("\n"),
          links.arrival.join("\n"),
          links.departure.join("\n"),
          d.message,
          uploadStatus,
        ];

        const res = await fetch(
          `${SHEETS}/spreadsheets/${sheetId}/values/RSVPs!A:U:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
              "X-Connection-Api-Key": sheetsKey,
            },
            body: JSON.stringify({ values: [row] }),
          },
        );
        if (!res.ok) {
          console.error(`Sheets append failed [${res.status}]: ${await res.text()}`);
          return json({ ok: false, error: "We couldn't save your RSVP — please try again." }, 502);
        }
        return json({ ok: true, uploadStatus });
      },
    },
  },
});

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Google Sheets gateway (connector-backed). All calls run server-side only;
// guests never see credentials or the sheet.
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

const rsvpSchema = z.object({
  name: z.string().trim().min(2).max(200),
  guests: z.number().int().min(1).max(20),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  attending: z.enum(["yes", "no"]),
  events: z.array(z.string().max(80)).max(10).default([]),
  message: z.string().trim().max(500).default(""),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

export type RsvpResult = { ok: true } | { ok: false; error: string };

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => rsvpSchema.parse(data))
  .handler(async ({ data }): Promise<RsvpResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    const connKey = process.env["GOOGLE_SHEETS_API_KEY"];
    const sheetId = process.env["WEDDING_SHEET_ID"];

    if (!apiKey || !connKey || !sheetId) {
      console.error("RSVP not configured: missing LOVABLE_API_KEY / GOOGLE_SHEETS_API_KEY / WEDDING_SHEET_ID");
      return {
        ok: false,
        error:
          "The RSVP book isn't connected yet — please share your details with the family directly for now.",
      };
    }

    const row = [
      [
        new Date().toISOString(),
        data.name,
        String(data.guests),
        data.email,
        data.phone,
        data.attending === "yes" ? "Yes — attending" : "No — regrets",
        data.events.join(", "),
        data.message,
      ],
    ];

    // Range must NOT be encodeURIComponent'd — the colon is valid in the path.
    const url = `${GATEWAY_URL}/spreadsheets/${sheetId}/values/RSVPs!A:H:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "X-Connection-Api-Key": connKey,
        },
        body: JSON.stringify({ values: row }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(`Sheets append failed [${res.status}]: ${body}`);
        return {
          ok: false,
          error:
            "We couldn't record your RSVP just now — please try again in a moment.",
        };
      }

      return { ok: true };
    } catch (err) {
      console.error("Sheets append error:", err);
      return {
        ok: false,
        error:
          "We couldn't reach the RSVP book — please try again in a moment.",
      };
    }
  });

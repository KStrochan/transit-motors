import { z } from "zod";

export const MAX_NAME = 100;
export const MAX_EMAIL = 254;
export const MAX_MESSAGE = 2000;

/**
 * Hidden field that real visitors never see. The name is deliberately one
 * that browsers and password managers have no autofill rule for.
 */
export const HONEYPOT_FIELD = "referral_code";

export type Lead = {
  name: string;
  email: string;
  message: string;
};

export type LeadErrors = Partial<Record<keyof Lead, string>>;

export type ParseResult =
  | { status: "ok"; lead: Lead }
  | { status: "invalid"; errors: LeadErrors }
  | { status: "spam" };

export type FormState = {
  status: "idle" | "sent" | "demo" | "invalid" | "error";
  errors?: LeadErrors;
  /** What the visitor typed, returned on failure so the form can be refilled. */
  values?: Lead;
};

const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please tell us your name.")
    .max(MAX_NAME, `Please keep your name to ${MAX_NAME} characters or fewer.`)
    .regex(/^[^\r\n]*$/, "Please put your name on a single line."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .max(MAX_EMAIL, "That email address looks too long.")
    .pipe(z.email("Please enter a valid email address.")),
  message: z
    .string()
    .trim()
    .min(1, "Please add a short message.")
    .max(MAX_MESSAGE, `Please keep your message to ${MAX_MESSAGE} characters or fewer.`),
});

function text(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
}

export function readLeadValues(data: FormData): Lead {
  return { name: text(data, "name"), email: text(data, "email"), message: text(data, "message") };
}

export function parseLead(data: FormData): ParseResult {
  if (text(data, HONEYPOT_FIELD).trim() !== "") {
    return { status: "spam" };
  }

  const result = leadSchema.safeParse(readLeadValues(data));

  if (result.success) {
    return { status: "ok", lead: result.data };
  }

  const errors: LeadErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof Lead;
    errors[field] ??= issue.message;
  }
  return { status: "invalid", errors };
}

"use server";

import { site } from "@/content/site";
import { parseLead, readLeadValues, type FormState } from "@/lib/lead";
import { isTelegramConfigured, sendToTelegram } from "@/lib/telegram";

export async function submitLead(_prev: FormState, data: FormData): Promise<FormState> {
  const env = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  };
  const parsed = parseLead(data);

  if (parsed.status === "spam") {
    console.info("Lead dropped by honeypot");
    // Same answer a person would get, so bots learn nothing from the response.
    return { status: isTelegramConfigured(env) ? "sent" : "demo" };
  }
  if (parsed.status === "invalid") {
    return { status: "invalid", errors: parsed.errors, values: readLeadValues(data) };
  }

  const delivery = await sendToTelegram(parsed.lead, { ...env, siteName: site.name });

  if (delivery.status === "failed") return { status: "error", values: parsed.lead };
  return { status: delivery.status };
}

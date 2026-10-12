import type { Lead } from "./lead";

/** Telegram rejects messages longer than this after entity parsing. */
export const TELEGRAM_MAX_TEXT = 4096;
const TIMEOUT_MS = 5000;

type TelegramEnv = {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
};

type TelegramConfig = TelegramEnv & {
  /** Shown in the message header so leads from several sites can share one chat. */
  siteName?: string;
};

export type DeliveryResult = { status: "sent" } | { status: "demo" } | { status: "failed" };

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Escapes text and cuts it so the escaped result fits in `budget` characters. */
function escapeWithin(value: string, budget: number): string {
  const escaped = escapeHtml(value);
  if (escaped.length <= budget) return escaped;

  let out = "";
  for (const char of value) {
    const next = escapeHtml(char);
    if (out.length + next.length > budget - 1) break;
    out += next;
  }
  return `${out}…`;
}

export function isTelegramConfigured(env: TelegramEnv): boolean {
  return Boolean(env.TELEGRAM_BOT_TOKEN?.trim() && env.TELEGRAM_CHAT_ID?.trim());
}

export function formatLeadMessage(lead: Lead, siteName = "the website"): string {
  const head = [
    `<b>New enquiry from ${escapeHtml(siteName)}</b>`,
    "",
    `<b>Name:</b> ${escapeHtml(lead.name)}`,
    `<b>Email:</b> ${escapeHtml(lead.email)}`,
    "",
    "",
  ].join("\n");

  return head + escapeWithin(lead.message, TELEGRAM_MAX_TEXT - head.length);
}

export async function sendToTelegram(
  lead: Lead,
  config: TelegramConfig,
  fetchImpl: typeof fetch = fetch,
): Promise<DeliveryResult> {
  const token = config.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = config.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    // Visitor details stay out of production logs; locally they help when testing the form.
    const details = process.env.NODE_ENV === "production" ? "details hidden in production" : lead;
    console.info("Demo mode: Telegram is not configured, lead not delivered", details);
    return { status: "demo" };
  }

  try {
    const response = await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatLeadMessage(lead, config.siteName),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(`Telegram delivery failed with HTTP ${response.status}`);
      return { status: "failed" };
    }
    return { status: "sent" };
  } catch (error) {
    // Only the error name is logged: messages can include the request URL, which holds the token.
    console.error(`Telegram delivery failed: ${error instanceof Error ? error.name : "unknown error"}`);
    return { status: "failed" };
  }
}

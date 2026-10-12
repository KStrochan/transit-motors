import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { Lead } from "@/lib/lead";
import { formatLeadMessage, isTelegramConfigured, sendToTelegram, TELEGRAM_MAX_TEXT } from "@/lib/telegram";

const lead: Lead = { name: "Ann", email: "ann@example.com", message: "Hello there" };
const env = { TELEGRAM_BOT_TOKEN: "123:secret-token", TELEGRAM_CHAT_ID: "42" };

function okFetch() {
  return vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
}

describe("formatLeadMessage", () => {
  test("header names the site the lead came from", () => {
    expect(formatLeadMessage(lead, "Thermaline").split("\n")[0]).toContain("Thermaline");
  });

  test("escapes <, > and & in every field", () => {
    const text = formatLeadMessage({ name: "<b>Ann</b>", email: "a&b@x.com", message: "1 < 2 & 3 > 2" });
    expect(text).toContain("&lt;b&gt;Ann&lt;/b&gt;");
    expect(text).toContain("a&amp;b@x.com");
    expect(text).toContain("1 &lt; 2 &amp; 3 &gt; 2");
    expect(text).not.toContain("<b>Ann");
    expect(text).not.toMatch(/&(?!amp;|lt;|gt;)/);
  });

  test("stays within Telegram's text limit when a long message is all special characters", () => {
    const text = formatLeadMessage({ ...lead, message: "&".repeat(2000) });
    expect(text.length).toBeLessThanOrEqual(TELEGRAM_MAX_TEXT);
    expect(text).not.toMatch(/&(?!amp;|lt;|gt;)/);
  });
});

describe("isTelegramConfigured", () => {
  test("needs both a token and a chat id", () => {
    expect(isTelegramConfigured(env)).toBe(true);
    expect(isTelegramConfigured({ TELEGRAM_BOT_TOKEN: "x" })).toBe(false);
    expect(isTelegramConfigured({ TELEGRAM_BOT_TOKEN: " ", TELEGRAM_CHAT_ID: "42" })).toBe(false);
  });
});

describe("sendToTelegram", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns demo without env and does not call fetch", async () => {
    const fetchImpl = okFetch();
    expect(await sendToTelegram(lead, {}, fetchImpl)).toEqual({ status: "demo" });
    expect(await sendToTelegram(lead, { TELEGRAM_BOT_TOKEN: "x" }, fetchImpl)).toEqual({ status: "demo" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test("demo mode writes a line to the server console", async () => {
    await sendToTelegram(lead, {}, okFetch());
    expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/demo mode/i), expect.anything());
  });

  test("posts to the bot API when configured", async () => {
    const fetchImpl = okFetch();
    expect(await sendToTelegram(lead, env, fetchImpl)).toEqual({ status: "sent" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url.startsWith("https://api.telegram.org/bot")).toBe(true);
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({ chat_id: "42", parse_mode: "HTML" });
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  test("returns failed on non-ok response", async () => {
    const fetchImpl = vi.fn(async () => new Response("Bad Request", { status: 400 }));
    expect(await sendToTelegram(lead, env, fetchImpl)).toEqual({ status: "failed" });
  });

  test("returns failed on network error or timeout", async () => {
    const network = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    const timeout = vi.fn(async () => {
      throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
    });
    expect(await sendToTelegram(lead, env, network)).toEqual({ status: "failed" });
    expect(await sendToTelegram(lead, env, timeout)).toEqual({ status: "failed" });
  });

  test("failure result never contains the token", async () => {
    const errorSpy = vi.mocked(console.error);
    const fetchImpl = vi.fn(async () => {
      throw new Error(`request to https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage failed`);
    });
    const result = await sendToTelegram(lead, env, fetchImpl);
    expect(JSON.stringify(result)).not.toContain(env.TELEGRAM_BOT_TOKEN);
    for (const call of errorSpy.mock.calls) {
      expect(JSON.stringify(call)).not.toContain(env.TELEGRAM_BOT_TOKEN);
    }
  });
});

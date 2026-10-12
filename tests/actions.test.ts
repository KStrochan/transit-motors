import { beforeEach, describe, expect, test, vi } from "vitest";

const sendToTelegram = vi.fn();
const isTelegramConfigured = vi.fn(() => true);
vi.mock("@/lib/telegram", () => ({ sendToTelegram, isTelegramConfigured }));

const { submitLead } = await import("@/app/actions");
const { site } = await import("@/content/site");
const { HONEYPOT_FIELD } = await import("@/lib/lead");

const idle = { status: "idle" } as const;

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const valid = { name: "Ann", email: "ann@example.com", message: "Hello there" };

describe("submitLead maps statuses", () => {
  beforeEach(() => {
    sendToTelegram.mockReset();
    isTelegramConfigured.mockReturnValue(true);
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  test("spam looks sent and never reaches Telegram", async () => {
    expect(await submitLead(idle, form({ ...valid, [HONEYPOT_FIELD]: "bot" }))).toEqual({ status: "sent" });
    expect(sendToTelegram).not.toHaveBeenCalled();
    expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/honeypot/i));
  });

  test("spam in demo mode gets the demo answer, never a delivery claim", async () => {
    isTelegramConfigured.mockReturnValue(false);
    expect(await submitLead(idle, form({ ...valid, [HONEYPOT_FIELD]: "bot" }))).toEqual({ status: "demo" });
    expect(sendToTelegram).not.toHaveBeenCalled();
  });

  test("tells Telegram which site the lead came from", async () => {
    sendToTelegram.mockResolvedValue({ status: "sent" });
    await submitLead(idle, form(valid));
    expect(sendToTelegram).toHaveBeenCalledWith(valid, expect.objectContaining({ siteName: site.name }));
  });

  test("invalid returns field errors without calling Telegram", async () => {
    const state = await submitLead(idle, form({ ...valid, email: "nope" }));
    expect(state.status).toBe("invalid");
    expect(state.errors?.email).toBeTruthy();
    expect(sendToTelegram).not.toHaveBeenCalled();
  });

  test("sent is passed through", async () => {
    sendToTelegram.mockResolvedValue({ status: "sent" });
    expect(await submitLead(idle, form(valid))).toEqual({ status: "sent" });
  });

  test("failed becomes error", async () => {
    sendToTelegram.mockResolvedValue({ status: "failed" });
    expect(await submitLead(idle, form(valid))).toMatchObject({ status: "error" });
  });

  test("demo is passed through", async () => {
    sendToTelegram.mockResolvedValue({ status: "demo" });
    expect(await submitLead(idle, form(valid))).toEqual({ status: "demo" });
  });

  test("invalid and error responses return the submitted values so the form can be refilled", async () => {
    const invalid = await submitLead(idle, form({ ...valid, email: "nope" }));
    expect(invalid.values).toEqual({ ...valid, email: "nope" });

    sendToTelegram.mockResolvedValue({ status: "failed" });
    const failed = await submitLead(idle, form(valid));
    expect(failed.values).toEqual(valid);
  });
});

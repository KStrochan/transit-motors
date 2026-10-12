import { describe, expect, test } from "vitest";
import { HONEYPOT_FIELD, MAX_MESSAGE, parseLead } from "@/lib/lead";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const valid = { name: "Ann", email: "ann@example.com", message: "Hello there" };

describe("parseLead", () => {
  test("accepts a valid lead", () => {
    expect(parseLead(form(valid))).toEqual({ status: "ok", lead: valid });
  });

  test("rejects bad email", () => {
    const result = parseLead(form({ ...valid, email: "ann@" }));
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") expect(result.errors.email).toBeTruthy();
  });

  test("rejects empty name and message", () => {
    const result = parseLead(form({ ...valid, name: "   ", message: "" }));
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") {
      expect(result.errors.name).toBeTruthy();
      expect(result.errors.message).toBeTruthy();
    }
  });

  test("treats missing fields as empty instead of throwing", () => {
    const result = parseLead(new FormData());
    expect(result.status).toBe("invalid");
  });

  test("rejects message over 2000 chars with a friendly error", () => {
    expect(MAX_MESSAGE).toBe(2000);
    const result = parseLead(form({ ...valid, message: "a".repeat(2001) }));
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") expect(result.errors.message).toContain("2000 characters or fewer");
  });

  test("accepts a message of exactly 2000 chars", () => {
    expect(parseLead(form({ ...valid, message: "a".repeat(2000) })).status).toBe("ok");
  });

  test("accepts emoji-only and right-to-left text within limits", () => {
    expect(parseLead(form({ ...valid, message: "😀😀😀" })).status).toBe("ok");
    expect(parseLead(form({ ...valid, name: "مرحبا", message: "مرحبا" })).status).toBe("ok");
  });

  test("honeypot returns spam", () => {
    expect(parseLead(form({ ...valid, [HONEYPOT_FIELD]: "x" }))).toEqual({ status: "spam" });
  });

  test("honeypot name is not something browsers or password managers autofill", () => {
    expect(HONEYPOT_FIELD).not.toMatch(/web|site|url|mail|name|phone|tel|address|company|org/i);
  });

  test("rejects line breaks in the name so it cannot fake extra lines in the notification", () => {
    const result = parseLead(form({ ...valid, name: "Ann\nEmail: evil@example.com" }));
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") expect(result.errors.name).toBeTruthy();
  });

  test("trims whitespace", () => {
    const result = parseLead(form({ name: "  Ann ", email: " ann@example.com ", message: "\n Hello there \n" }));
    expect(result).toEqual({ status: "ok", lead: valid });
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { LeadForm } from "@/components/LeadForm";
import { HONEYPOT_FIELD, type FormState } from "@/lib/lead";

type Action = (prev: FormState, data: FormData) => Promise<FormState>;

function resolvingTo(state: FormState) {
  return vi.fn<Action>(async () => state);
}

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), "Ann");
  await user.type(screen.getByLabelText(/email/i), "ann@example.com");
  await user.type(screen.getByLabelText(/message/i), "Hello there");
  await user.click(screen.getByRole("button", { name: /send/i }));
}

describe("LeadForm", () => {
  test("every input has an associated label", () => {
    render(<LeadForm action={resolvingTo({ status: "idle" })} />);
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("name", "name");
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/message/i).tagName).toBe("TEXTAREA");
  });

  test("shows field errors with aria-describedby and role=alert", async () => {
    const user = userEvent.setup();
    render(
      <LeadForm
        action={resolvingTo({ status: "invalid", errors: { email: "Please enter a valid email address." } })}
      />,
    );
    await fillAndSubmit(user);

    const error = await screen.findByText("Please enter a valid email address.");
    expect(error).toHaveAttribute("role", "alert");
    const email = screen.getByLabelText(/email/i);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email.getAttribute("aria-describedby")).toContain(error.id);
  });

  test("keeps entered values after an invalid submission", async () => {
    const user = userEvent.setup();
    render(
      <LeadForm
        action={resolvingTo({
          status: "invalid",
          errors: { email: "Please enter a valid email address." },
          values: { name: "Ann", email: "ann@example.com", message: "Hello there" },
        })}
      />,
    );
    await fillAndSubmit(user);
    await screen.findByText("Please enter a valid email address.");
    expect(screen.getByLabelText(/message/i)).toHaveValue("Hello there");
    expect(screen.getByLabelText(/name/i)).toHaveValue("Ann");
  });

  test("shows a success status in an aria-live region", async () => {
    const user = userEvent.setup();
    render(<LeadForm action={resolvingTo({ status: "sent" })} />);
    await fillAndSubmit(user);
    const status = await screen.findByRole("status");
    await waitFor(() => expect(status).toHaveTextContent(/thank/i));
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  test("demo state says the message was not delivered", async () => {
    const user = userEvent.setup();
    render(<LeadForm action={resolvingTo({ status: "demo" })} />);
    await fillAndSubmit(user);
    const status = await screen.findByRole("status");
    await waitFor(() => expect(status).toHaveTextContent(/demo/i));
    expect(status.textContent).not.toMatch(/\bsent\b/i);
  });

  test("error state shows a generic failure message", async () => {
    const user = userEvent.setup();
    render(<LeadForm action={resolvingTo({ status: "error" })} />);
    await fillAndSubmit(user);
    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });

  test("submit button is disabled while pending", async () => {
    const user = userEvent.setup();
    const action = vi.fn<Action>(() => new Promise<FormState>(() => {}));
    render(<LeadForm action={action} />);
    await fillAndSubmit(user);

    const button = screen.getByRole("button", { name: /send/i });
    await waitFor(() => expect(button).toBeDisabled());
    await user.click(button);
    expect(action).toHaveBeenCalledTimes(1);
  });

  test("honeypot field is hidden from users and assistive tech", () => {
    const { container } = render(<LeadForm action={resolvingTo({ status: "idle" })} />);
    const honeypot = container.querySelector(`input[name="${HONEYPOT_FIELD}"]`);
    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("autocomplete", "off");
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  test("prefills the message from defaultMessage", () => {
    render(<LeadForm action={resolvingTo({ status: "idle" })} defaultMessage="Estimate: 8 kW heat pump" />);
    expect(screen.getByLabelText(/message/i)).toHaveValue("Estimate: 8 kW heat pump");
  });

  test("uses a custom submit label", () => {
    render(<LeadForm action={resolvingTo({ status: "idle" })} submitLabel="Request a quote" />);
    expect(screen.getByRole("button", { name: "Request a quote" })).toBeInTheDocument();
  });
});

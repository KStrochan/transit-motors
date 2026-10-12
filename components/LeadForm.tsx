"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { HONEYPOT_FIELD, type FormState, type Lead } from "@/lib/lead";

type LeadFormProps = {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  /** Prefills the message, e.g. with an estimate the visitor just calculated. */
  defaultMessage?: string;
  submitLabel?: string;
};

const initialState: FormState = { status: "idle" };

const honeypotStyle = {
  position: "absolute",
  left: "-10000px",
  width: "1px",
  height: "1px",
  overflow: "hidden",
} as const;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="lead-form__submit" disabled={pending}>
      {pending ? "Sending…" : label}
    </button>
  );
}

type FieldProps = {
  name: keyof Lead;
  label: string;
  error?: string;
  defaultValue?: string;
  multiline?: boolean;
  type?: "text" | "email";
  autoComplete?: string;
};

function Field({ name, label, error, defaultValue, multiline, type = "text", autoComplete }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    defaultValue,
    required: true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: "lead-form__control",
  };

  return (
    <div className="lead-form__field">
      <label htmlFor={id} className="lead-form__label">
        {label}
      </label>
      {multiline ? (
        <textarea rows={5} {...shared} />
      ) : (
        <input type={type} autoComplete={autoComplete} {...shared} />
      )}
      {error ? (
        <p id={errorId} role="alert" className="lead-form__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function LeadForm({ action, defaultMessage, submitLabel = "Send message" }: LeadFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const errors = state.errors ?? {};
  const values = state.values;

  return (
    <form action={formAction} noValidate className="lead-form">
      <Field name="name" label="Name" autoComplete="name" error={errors.name} defaultValue={values?.name} />
      <Field
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email}
        defaultValue={values?.email}
      />
      <Field
        name="message"
        label="Message"
        multiline
        error={errors.message}
        defaultValue={values?.message ?? defaultMessage}
      />

      <div aria-hidden="true" style={honeypotStyle}>
        <label htmlFor="lead-website">Leave this field empty</label>
        <input id="lead-website" type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton label={submitLabel} />

      <p role="status" aria-live="polite" className="lead-form__status">
        {state.status === "sent" ? "Thank you. Your message is on its way and we'll reply soon." : null}
        {state.status === "demo"
          ? "This is a demo site, so your message was not delivered anywhere. Nothing was stored."
          : null}
      </p>

      {state.status === "error" ? (
        <p role="alert" className="lead-form__error">
          Something went wrong and your message didn&apos;t go through. Please try again in a minute.
        </p>
      ) : null}
    </form>
  );
}

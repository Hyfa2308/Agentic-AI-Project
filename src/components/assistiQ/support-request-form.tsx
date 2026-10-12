import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, FileText, Info, Paperclip, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, isMockMode } from "@/services/api";
import {
  issueCategories,
  requestedPriorities,
  type SupportRequestPayload,
  type SupportRequestResult,
} from "@/types/support";
import {
  emptyForm,
  supportRequestSchema,
  validateAttachment,
  type SupportRequestForm as FormValues,
} from "@/lib/support-request";

type Errors = Partial<Record<keyof FormValues | "attachment", string>>;
const selectClass =
  "border-input bg-background focus-visible:ring-ring/50 focus-visible:border-ring h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] aria-invalid:border-destructive";

function Field({
  id, label, required, error, hint, children,
}: { id: string; label: string; required?: boolean; error?: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive" aria-hidden="true">*</span> : <span className="text-muted-foreground text-xs font-normal">(optional)</span>}
      </Label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-muted-foreground text-xs">{hint}</p>}
      {error && <p id={`${id}-error`} className="text-destructive text-xs" role="alert">{error}</p>}
    </div>
  );
}

export function SupportRequestForm() {
  const uid = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ res: SupportRequestResult; payload: SupportRequestPayload } | null>(null);
  const mutation = useMutation({
    mutationFn: (payload: SupportRequestPayload) => api.submitSupportRequest(payload),
    onSuccess: (res, payload) => setResult({ res, payload }),
  });

  const id = (k: string) => `${uid}-${k}`;
  const set = (k: keyof FormValues) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };
  const aria = (k: keyof FormValues) => ({
    id: id(k),
    "aria-invalid": !!errors[k] || undefined,
    "aria-describedby": errors[k] ? `${id(k)}-error` : `${id(k)}-hint`,
  });

  const clear = () => {
    setValues(emptyForm);
    setErrors({});
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    mutation.reset();
  };

  const onFile = (f: File | undefined) => {
    if (!f) return;
    const err = validateAttachment(f);
    setErrors((er) => ({ ...er, attachment: err ?? undefined }));
    setFile(err ? null : f);
    if (err && fileRef.current) fileRef.current.value = "";
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (mutation.isPending) return;
    const parsed = supportRequestSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormValues;
        next[k] ??= issue.message;
      }
      setErrors((er) => ({ ...next, attachment: er.attachment }));
      const first = Object.keys(next)[0];
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    const d = parsed.data;
    mutation.mutate({
      fullName: d.fullName,
      email: d.email,
      phone: d.phone || null,
      category: d.category,
      subject: d.subject,
      description: d.description,
      requestedPriority: d.requestedPriority,
      productAffected: d.productAffected || null,
    });
  };

  if (result) {
    const { res, payload } = result;
    return (
      <section className="rounded-xl border bg-card p-6" aria-live="polite">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="text-primary mt-0.5 size-6 shrink-0" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">
              {res.persisted ? "Support request submitted" : "Demo request received (not saved)"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {res.persisted
                ? "Your ticket has been created. Keep this reference for follow-ups."
                : "The backend is not connected, so this demo reference was generated in your browser. No ticket was saved and no one has been notified."}
            </p>
          </div>
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          {[
            ["Ticket reference", res.ticketReference],
            ["Subject", payload.subject],
            ["Category", payload.category],
            ["Requested priority", payload.requestedPriority],
            ["Contact", `${payload.fullName} · ${payload.email}`],
            ["Product or service", payload.productAffected ?? "—"],
            ["Attachment", file ? `${file.name} (selected locally, not uploaded)` : "None"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5">
              <dt className="text-muted-foreground text-xs">{k}</dt>
              <dd className="font-medium break-words">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={() => { setResult(null); clear(); }}>Submit another request</Button>
          <Button variant="outline" onClick={() => { setResult(null); clear(); document.getElementById("ticket-list")?.scrollIntoView({ behavior: "smooth" }); }}>
            Back to portal
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-card p-5 sm:p-6" aria-labelledby={id("title")}>
      <div className="mb-5 flex flex-col gap-1">
        <h2 id={id("title")} className="text-xl font-semibold">Submit a Support Request</h2>
        <p className="text-muted-foreground text-sm">
          Describe your issue and our support team will help you resolve it. Fields marked
          <span className="text-destructive"> *</span> are required.
        </p>
      </div>
      {isMockMode && (
        <Alert className="mb-5">
          <Info aria-hidden="true" />
          <AlertTitle>Demo mode</AlertTitle>
          <AlertDescription>The support backend isn’t connected. Submissions are simulated and not saved.</AlertDescription>
        </Alert>
      )}
      {mutation.isError && (
        <Alert variant="destructive" className="mb-5" role="alert">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Your request wasn’t submitted</AlertTitle>
          <AlertDescription>{mutation.error.message} Your details have been kept so you can try again.</AlertDescription>
        </Alert>
      )}
      <form onSubmit={submit} noValidate className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-4" disabled={mutation.isPending}>
          <legend className="mb-3 text-sm font-semibold">Your Contact Information</legend>
          <div className="grid gap-4 md:grid-cols-3">
            <Field id={id("fullName")} label="Full Name" required error={errors.fullName}>
              <Input {...aria("fullName")} autoComplete="name" placeholder="Jane Cooper" value={values.fullName} onChange={set("fullName")} maxLength={100} />
            </Field>
            <Field id={id("email")} label="Email Address" required error={errors.email}>
              <Input {...aria("email")} type="email" autoComplete="email" placeholder="jane@company.com" value={values.email} onChange={set("email")} maxLength={255} />
            </Field>
            <Field id={id("phone")} label="Mobile Number" error={errors.phone}>
              <Input {...aria("phone")} type="tel" autoComplete="tel" placeholder="+1 555 010 2030" value={values.phone} onChange={set("phone")} maxLength={20} />
            </Field>
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-4" disabled={mutation.isPending}>
          <legend className="mb-3 text-sm font-semibold">Issue Details</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <Field id={id("category")} label="Category of Issue" required error={errors.category}>
              <select {...aria("category")} className={selectClass} value={values.category} onChange={set("category")}>
                <option value="" disabled>Select a category</option>
                {issueCategories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field id={id("requestedPriority")} label="Priority" required error={errors.requestedPriority}
              hint="How urgent this is for you. AssistIQ may assess the actual priority separately.">
              <select {...aria("requestedPriority")} className={selectClass} value={values.requestedPriority} onChange={set("requestedPriority")}>
                <option value="" disabled>Select priority</option>
                {requestedPriorities.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
          </div>
          <Field id={id("subject")} label="Subject" required error={errors.subject} hint={`${values.subject.length}/255`}>
            <Input {...aria("subject")} placeholder="Short summary of the issue" value={values.subject} onChange={set("subject")} maxLength={255} />
          </Field>
          <Field id={id("description")} label="Description" required error={errors.description}
            hint={`Minimum 20 characters · ${values.description.length}/5000`}>
            <Textarea {...aria("description")} rows={6} placeholder="What happened, when it started, and any steps you’ve already tried." value={values.description} onChange={set("description")} maxLength={5000} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field id={id("productAffected")} label="Product or Service Affected" error={errors.productAffected}>
              <Input {...aria("productAffected")} placeholder="e.g. Mobile app, Pro plan" value={values.productAffected} onChange={set("productAffected")} maxLength={150} />
            </Field>
            <Field id={id("attachment")} label="Attachment" error={errors.attachment}
              hint="PNG, JPG, JPEG or PDF up to 5 MB. Files are only selected locally and are not uploaded yet.">
              <Input id={id("attachment")} ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
                aria-invalid={!!errors.attachment || undefined}
                aria-describedby={errors.attachment ? `${id("attachment")}-error` : `${id("attachment")}-hint`}
                onChange={(e) => onFile(e.target.files?.[0])} />
            </Field>
          </div>
          {file && (
            <div className="bg-muted flex items-center gap-2 rounded-md px-3 py-2 text-sm">
              {file.type === "application/pdf" ? <FileText className="size-4" aria-hidden="true" /> : <Paperclip className="size-4" aria-hidden="true" />}
              <span className="truncate">{file.name}</span>
              <span className="text-muted-foreground shrink-0 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB · not uploaded</span>
              <Button type="button" variant="ghost" size="icon-xs" className="ml-auto" aria-label={`Remove ${file.name}`}
                onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }}>
                <X />
              </Button>
            </div>
          )}
        </fieldset>
        <div className="flex flex-wrap items-center gap-2 border-t pt-5">
          <Button type="submit" size="lg" disabled={mutation.isPending}>
            <Send />
            {mutation.isPending ? "Submitting…" : "Submit Support Request"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={clear} disabled={mutation.isPending}>Clear Form</Button>
          {isMockMode && (
            <Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={() => api.simulateError()} disabled={mutation.isPending}>
              Test error state
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

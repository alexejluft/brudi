---
name: validating-forms
description: Use when building forms with validation, file uploads, multi-step flows, or integrating server validation into React UIs.
---

# Validating Forms

## The Rule

**Validate on BOTH client (UX) and server (security).** Zod schema = single source of truth for both. Use `mode: "onBlur"` not `onChange`. Wire ARIA attributes for every error field.

---

## Zod + React Hook Form

```tsx
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
}).strict()

export function SignupForm() {
  const { register, handleSubmit, setFocus, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  })

  useEffect(() => {
    const firstError = Object.keys(errors)[0]
    if (firstError) setFocus(firstError)
  }, [errors, setFocus])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input id="email" {...register("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
      {errors.email && <p id="email-err" role="alert">{errors.email.message}</p>}
    </form>
  )
}

// ❌ WRONG: onChange + no ARIA + no focus
const { register } = useForm({ mode: "onChange" })
```

---

## Server Validation (Same Schema)

```tsx
export async function POST(req: Request) {
  const result = schema.safeParse(await req.json())
  if (!result.success) {
    return Response.json({ errors: result.error.flatten().fieldErrors }, { status: 400 })
  }
  await db.users.create(result.data)
  return Response.json({ success: true })
}
// ❌ WRONG: Client-only validation → attacker bypasses with curl
```

---

## React 19: useActionState

```tsx
"use server"
export async function submitForm(prevState: any, formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData))
  if (!result.success) return { errors: result.error.flatten().fieldErrors }
  await db.users.create(result.data)
  return { success: true }
}

const [state, formAction] = useActionState(submitForm, null)
<form action={formAction}>
  <input name="email" />
  {state?.errors?.email && <p role="alert">{state.errors.email}</p>}
</form>
```

---

## File Upload Validation

```tsx
const uploadSchema = z.object({
  file: z.instanceof(File)
    .refine(f => f.size <= 5 * 1024 * 1024, "Max 5MB")
    .refine(f => ["image/jpeg", "image/png"].includes(f.type), "JPG/PNG only"),
})
// ❌ WRONG: No size/type check → DoS + malware risk
```

---

## Multi-Step: Persist State

```tsx
const handleNext = () => {
  setFormData(prev => ({ ...prev, ...getValues() }))
  setStep(s => s + 1)
}
// ❌ WRONG: No state persistence → user loses data
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `mode: "onChange"` | Use `mode: "onBlur"` for performance |
| Client-only validation | Server validates with same Zod schema |
| No ARIA (`aria-invalid`, `aria-describedby`) | Wire both to every error field |
| No focus on first error | `setFocus()` in useEffect |
| File upload without size/type check | Zod `refine()` on File object |
| Multi-step loses data | `useState` or Context to persist |
| Not using `useActionState` (React 19) | Server Actions + useActionState |

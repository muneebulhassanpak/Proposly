import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  // min(1) only — never reveal password requirements at the login screen
  password: z.string().min(1, "Password is required"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

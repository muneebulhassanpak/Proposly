import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  // min(1) only — never reveal password requirements at the login screen
  password: z.string().min(1),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

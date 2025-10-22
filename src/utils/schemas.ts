import { z } from "zod";

// Esquema Zod para UserLogin
export const UserLoginSchema = z.object({
  user: z.string(),
  email: z.string().email(),
  password: z.string(),
  accessToken: z.string(),
});
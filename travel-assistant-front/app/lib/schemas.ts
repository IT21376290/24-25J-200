import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(1).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(20),
  confirmPassword: z.string().min(8).max(20)
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20)
});

export const profileCreationSchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(20),
  birthOfDate: z.date(),
  contactNumber: z.string(),
  countryOfOrgin: z.string(),
  address: z.string(),
  postalZip: z.string()
});
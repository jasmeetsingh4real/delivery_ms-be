import { z } from "zod";

export const loginDetailsSchema = z.object({
  userName: z.string().min(1),
  password: z.string().min(1),
});

import { z } from "zod";

export const BlogValidator = z.object({
  title: z.string().min(3).max(100),
  content: z.string(),
  coverImage: z.string(),
  tags: z.string(),
});

export type BlogPayload = z.infer<typeof BlogValidator>;

import z from "zod";

export const zodJwtClaimsSchema = z.object({
  id: z.string(),
  name: z.string(),
  token: z.string(),
});

export type JwtClaims = z.infer<typeof zodJwtClaimsSchema>;

export const zodMenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  // fixme: js float gives rounding errors
  price: z.coerce.number(),
  imageUrl: z.string().optional().nullable(),
});
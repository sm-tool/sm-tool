import { z } from 'zod';

export const qdsUserEntitySchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(2).max(32),
  last_name: z.string().min(2).max(32),
});

export const userViewModel = qdsUserEntitySchema
  .extend({
    fullName: z.string().optional(),
  })
  .transform(user => {
    `${user.first_name} ${user.last_name}`;
  });
export type UserViewModel = z.infer<typeof userViewModel>;

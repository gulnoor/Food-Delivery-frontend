import { createContext } from "react";
import z from "zod";

export const zodUserSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  token: z.string().nonempty(),
});

export type User = z.infer<typeof zodUserSchema>;

interface UserContextValue {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextValue | null>(null);

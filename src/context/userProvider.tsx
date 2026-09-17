import { useMemo, useState, type ReactNode } from "react";
import { UserContext, type User } from "./contexts";

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={useMemo(() => ({ user, setUser }), [user])}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

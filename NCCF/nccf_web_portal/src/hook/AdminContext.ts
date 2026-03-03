import { createContext } from "react";

interface AdminContextInterface {
  isAdmin: boolean;
  setIsAdmin: () => void;
}

export const AdminContext = createContext<AdminContextInterface | undefined>(
  undefined,
);

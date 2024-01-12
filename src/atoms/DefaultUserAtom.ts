// Import Recoil
import { atom } from "recoil";

type User = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
};

const initialUserState: User = {
  id: 0,
  name: "",
  email: "",
  gender: "",
  status: "",
};

// Create a Recoil atom
export const defaultUserState = atom({
  key: "defaultUserState",
  default: initialUserState,
});

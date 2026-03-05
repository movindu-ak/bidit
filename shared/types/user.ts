export type UserRole = "user" | "admin";

export interface UserDTO {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  role: UserRole;
  walletBalance: number;
  favorites: string[];
  createdAt?: string;
  updatedAt?: string;
}
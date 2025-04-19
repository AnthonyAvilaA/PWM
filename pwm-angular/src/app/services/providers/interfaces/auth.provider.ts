import { AuthUser, LoginData, RegisterData, AuthResult } from "@models/auth";

export interface AuthProvider {
  register(data: RegisterData): Promise<AuthResult>;
  login(data: LoginData): Promise<AuthResult>;
  logout(): Promise<boolean>;
  getCurrentUser(): Promise<AuthUser | null>;
}

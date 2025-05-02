import { AuthUser, LoginData, RegisterData, AuthResult } from "@models/auth.model";

/**
 * Interface defining the contract for authentication provider implementations
 */
export interface AuthFirebaseServiceInterface {
  /**
   * Register a new user
   * @param data Registration data (email, password, name, etc.)
   * @returns Promise resolving to an AuthResult with success status and user data or error
   */
  register(data: RegisterData): Promise<AuthResult>;

  /**
   * Login with user credentials
   * @param data Login data (email, password, rememberMe)
   * @returns Promise resolving to an AuthResult with success status and user data or error
   */
  login(data: LoginData): Promise<AuthResult>;

  /**
   * Logout the current user
   * @returns Promise resolving to a boolean indicating success
   */
  logout(): Promise<boolean>;

  /**
   * Get the currently authenticated user
   * @returns Promise resolving to the current AuthUser or null if not authenticated
   */
  getCurrentUser(): Promise<AuthUser | null>;
}

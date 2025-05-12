import { Observable } from 'rxjs';
import { AuthUser, LoginData, RegisterData } from '../../../models/auth.model';

/**
 * Interface defining the contract for authentication services
 */
export interface IAuthService {
  /**
   * Observable of the current authenticated user
   */
  readonly currentUser$: Observable<AuthUser | null>;
  
  /**
   * Observable for tracking loading state
   */
  readonly isLoading$: Observable<boolean>;
  
  /**
   * Observable for error messages
   */
  readonly errorMessage$: Observable<string | null>;
  
  /**
   * Register a new user
   * @param data Registration data
   * @returns Observable indicating success
   */
  register(data: RegisterData): Observable<boolean>;
  
  /**
   * Login with email and password
   * @param data Login data
   * @returns Observable indicating success
   */
  login(data: LoginData): Observable<boolean>;
  
  /**
   * Logout the current user
   * @returns Observable indicating success
   */
  logout(): Observable<boolean>;
}

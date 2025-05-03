import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, from, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProviderService } from '../providers/provider.service';
import { AuthUser, LoginData, RegisterData } from '@models/auth.model';
import { Router } from '@angular/router';
import { IAuthService } from '@services/core/interfaces/auth-service.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$: Observable<AuthUser | null> = this.currentUserSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  private errorMessageSubject = new BehaviorSubject<string | null>(null);
  public errorMessage$ = this.errorMessageSubject.asObservable();

  // Keys for storage
  private readonly USER_DATA_KEY = 'pwm_user_data';
  private readonly SESSION_STORAGE_KEY = 'pwm_session_user';
  private readonly USE_PERSISTENT_STORAGE_KEY = 'pwm_use_persistent';

  constructor(
    private providerService: ProviderService,
    private router: Router
  ) {
    // Check for existing user on service initialization
    this.initAuthState();
  }

  // Initialize authentication state from storage
  private initAuthState(): void {
    this.isLoadingSubject.next(true);

    try {
      // First check localStorage (persistent login)
      const persistentData = localStorage.getItem(this.USER_DATA_KEY);
      const usePersistent = localStorage.getItem(this.USE_PERSISTENT_STORAGE_KEY) === 'true';

      // Then check sessionStorage (temporary login)
      const sessionData = sessionStorage.getItem(this.SESSION_STORAGE_KEY);

      if (persistentData && usePersistent) {
        // User chose to be remembered
        try {
          const user = JSON.parse(persistentData) as AuthUser;
          this.currentUserSubject.next(user);
        } catch (e) {
          console.error('Error parsing user data from localStorage:', e);
          this.clearAllSessions();
        }
      } else if (sessionData) {
        // User didn't choose to be remembered, but has an active session
        try {
          const user = JSON.parse(sessionData) as AuthUser;
          this.currentUserSubject.next(user);
        } catch (e) {
          console.error('Error parsing user data from sessionStorage:', e);
          this.clearAllSessions();
        }
      } else {
        // No valid session found, check with Firebase
        this.refreshUserFromFirebase();
      }
    } catch (e) {
      console.error('Error initializing auth state:', e);
      this.clearAllSessions();
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  // Refresh user data from Firebase
  private refreshUserFromFirebase(): void {
    from(this.providerService.authProvider.getCurrentUser()).pipe(
      tap(user => {
        if (user) {
          // Get the storage preference
          const usePersistent = localStorage.getItem(this.USE_PERSISTENT_STORAGE_KEY) === 'true';

          // Save the user based on their preference
          if (usePersistent) {
            this.saveUserDataPersistent(user);
          } else {
            this.saveUserDataSession(user);
          }
        } else {
          // No user found in Firebase, clear all sessions
          this.clearAllSessions();
        }
      }),
      catchError(() => {
        this.clearAllSessions();
        return of(null);
      })
    ).subscribe();
  }

  // Save user data to localStorage (persistent)
  private saveUserDataPersistent(user: AuthUser): void {
    try {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
      localStorage.setItem(this.USE_PERSISTENT_STORAGE_KEY, 'true');
      this.currentUserSubject.next(user);
    } catch (e) {
      console.error('Error saving user data to localStorage:', e);
    }
  }

  // Save user data to sessionStorage (temporary)
  private saveUserDataSession(user: AuthUser): void {
    try {
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(this.USE_PERSISTENT_STORAGE_KEY, 'false');
      this.currentUserSubject.next(user);
    } catch (e) {
      console.error('Error saving user data to sessionStorage:', e);
    }
  }

  // Clear all session data
  private clearAllSessions(): void {
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.USE_PERSISTENT_STORAGE_KEY);
    sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  // Register a new user
  register(data: RegisterData): Observable<boolean> {
    this.isLoadingSubject.next(true);
    this.errorMessageSubject.next(null);

    return from(this.providerService.authProvider.register(data)).pipe(
      map(result => {
        if (result.success && result.user) {
          // Save the user data to session storage by default for new registrations
          this.saveUserDataSession(result.user);
          return true;
        } else {
          this.errorMessageSubject.next(result.error || 'Registration failed.');
          return false;
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        this.errorMessageSubject.next('An unexpected error occurred during registration.');
        return of(false);
      }),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  // Login with email and password
  login(data: LoginData): Observable<boolean> {
    this.isLoadingSubject.next(true);
    this.errorMessageSubject.next(null);

    return from(this.providerService.authProvider.login(data)).pipe(
      map(result => {
        if (result.success && result.user) {
          // Save user data based on rememberMe preference
          if (data.rememberMe) {
            this.saveUserDataPersistent(result.user);
          } else {
            this.saveUserDataSession(result.user);
          }
          return true;
        } else {
          this.errorMessageSubject.next(result.error || 'Login failed.');
          return false;
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        this.errorMessageSubject.next('An unexpected error occurred during login.');
        return of(false);
      }),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  // Logout the current user
  logout(): Observable<boolean> {
    this.isLoadingSubject.next(true);

    return from(this.providerService.authProvider.logout()).pipe(
      tap(success => {
        if (success) {
          // Clear all session data
          this.clearAllSessions();
        }
      }),
      catchError(error => {
        console.error('Logout error:', error);
        return of(false);
      }),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Get the current user
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }
}

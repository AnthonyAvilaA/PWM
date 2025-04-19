import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, from, of, tap } from 'rxjs';
import { ProviderServiceService } from './provider-service.service';
import { AuthUser, LoginData, RegisterData } from '@models/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$: Observable<AuthUser | null> = this.currentUserSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  private errorMessageSubject = new BehaviorSubject<string | null>(null);
  public errorMessage$ = this.errorMessageSubject.asObservable();

  // Keys for localStorage
  private readonly USER_DATA_KEY = 'pwm_user_data';

  constructor(
    private providerService: ProviderServiceService,
    private router: Router
  ) {
    // Check for existing user on service initialization
    this.initAuthState();
  }

  // Initialize authentication state from localStorage
  private initAuthState(): void {
    this.isLoadingSubject.next(true);

    try {
      // Try to get user data from localStorage
      const userData = localStorage.getItem(this.USER_DATA_KEY);

      if (userData) {
        try {
          // Parse the user data and set it in the current user subject
          const user = JSON.parse(userData) as AuthUser;
          this.currentUserSubject.next(user);
        } catch (e) {
          console.error('Error parsing user data from localStorage:', e);
          this.clearSession();
        }
      } else {
        // No session, check with Firebase
        this.refreshUserFromFirebase();
      }
    } catch (e) {
      console.error('Error initializing auth state:', e);
      this.clearSession();
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  // Refresh user data from Firebase
  private refreshUserFromFirebase(): void {
    from(this.providerService.authProvider.getCurrentUser()).pipe(
      tap(user => {
        if (user) {
          // Save the user data to localStorage and update the current user
          this.saveUserData(user);
        } else {
          // No user found in Firebase, clear the session
          this.clearSession();
        }
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    ).subscribe();
  }

  // Save user data to localStorage
  private saveUserData(user: AuthUser): void {
    try {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
    } catch (e) {
      console.error('Error saving user data to localStorage:', e);
    }
  }

  // Clear the session data from localStorage
  private clearSession(): void {
    localStorage.removeItem(this.USER_DATA_KEY);
    this.currentUserSubject.next(null);
  }

  // Register a new user
  register(data: RegisterData): Observable<boolean> {
    this.isLoadingSubject.next(true);
    this.errorMessageSubject.next(null);

    return from(this.providerService.authProvider.register(data)).pipe(
      map(result => {
        if (result.success && result.user) {
          // Save the user data
          this.saveUserData(result.user);
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
          // Save the user data
          this.saveUserData(result.user);
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
          // Clear the session data
          this.clearSession();
          // Navigate to login page
          this.router.navigate(['/login']);
        }
      }),
      catchError(error => {
        console.error('Logout error:', error);
        // Clear the session data anyway to ensure the user is logged out locally
        this.clearSession();
        return of(true);
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

// Add missing import
import { map } from 'rxjs/operators';

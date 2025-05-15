import { Injectable } from '@angular/core';
import { auth } from './../../../environments/environment';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  // Register a new user
  register(email: string, password: string): Promise<User> {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => userCredential.user)
      .catch((error) => {
        console.error('Registration error:', error);
        throw error;
      });
  }

  // Login an existing user
  login(email: string, password: string): Promise<User> {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => userCredential.user)
      .catch((error) => {
        console.error('Login error:', error);
        throw error;
      });
  }

  // Logout the current user
  logout(): Promise<void> {
    return signOut(auth)
      .catch((error) => {
        console.error('Logout error:', error);
        throw error;
      });
  }

  // Get the currently logged-in user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
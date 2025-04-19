import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { AuthProvider } from '../interfaces/auth.provider';
import { AuthResult, AuthUser, LoginData, RegisterData } from '@models/auth';
import { auth } from 'environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseProviderService implements AuthProvider {
  private readonly db: Firestore;
  
  constructor(db: Firestore) {
    this.db = db;
  }

  async register(data: RegisterData): Promise<AuthResult> {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      // Create user document in Firestore
      const userDoc = {
        name: data.name,
        email: data.email,
        username: data.username || data.name,
      };
      
      await setDoc(doc(this.db, 'users', userCredential.user.uid), userDoc);
      
      // Return success with user data
      return {
        success: true,
        user: {
          id: userCredential.user.uid,
          ...userDoc,
        } as AuthUser
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: this.getFirebaseAuthErrorMessage(error.code)
      };
    }
  }

  async login(data: LoginData): Promise<AuthResult> {
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      // Fetch additional user data from Firestore
      const userDoc = await getDoc(doc(this.db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        return {
          success: true,
          user: {
            id: userCredential.user.uid,
            name: userData['name'],
            email: userData['email'],
            username: userData['username'] || userData['name'],
          } as AuthUser
        };
      } else {
        // In case the user exists in Auth but not in Firestore
        return {
          success: true,
          user: {
            id: userCredential.user.uid,
            name: userCredential.user.displayName || '',
            email: userCredential.user.email || '',
          } as AuthUser
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: this.getFirebaseAuthErrorMessage(error.code)
      };
    }
  }

  async logout(): Promise<boolean> {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return null;
    }
    
    try {
      const userDoc = await getDoc(doc(this.db, 'users', currentUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        return {
          id: currentUser.uid,
          name: userData['name'],
          email: userData['email'],
          username: userData['username'] || userData['name'],
        } as AuthUser;
      } else {
        return {
          id: currentUser.uid,
          name: currentUser.displayName || '',
          email: currentUser.email || '',
        } as AuthUser;
      }
    } catch (error) {
      console.error('Error fetching current user data:', error);
      return null;
    }
  }

  private getFirebaseAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email is already in use.';
      case 'auth/invalid-email':
        return 'Email address is invalid.';
      case 'auth/weak-password':
        return 'Password is too weak.';
      case 'auth/user-disabled':
        return 'User account has been disabled.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful login attempts. Please try again later.';
      case 'auth/configuration-not-found':
        return 'Authentication service misconfigured. Please contact support.';
      default:
        return 'An error occurred during authentication.';
    }
  }
}

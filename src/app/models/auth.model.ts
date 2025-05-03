export enum AuthMethod {
    EMAIL_PASSWORD = 'email_password',
    GOOGLE = 'google'
}

export interface UserAuth {
    type: AuthMethod;
    email: string;
    password?: string;
}

export interface AuthUser extends UserModel {
    id: string;
    username?: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    username?: string;
}

export interface LoginData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthResult {
    success: boolean;
    user?: AuthUser;
    error?: string;
}

import { UserModel } from './user.model';

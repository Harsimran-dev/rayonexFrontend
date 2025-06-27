import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  constructor() { }

  static saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static saveUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static getUserData(): any | null {
    const userString = localStorage.getItem(USER_KEY);
    return userString ? JSON.parse(userString) : null;
  }

  static getUserRole(): string {
    const user = this.getUserData();
    return user ? user.userRole : '';
  }

  static isAdminLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && this.getUserRole() === 'ADMIN';
  }

  static isUserLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return !!StoreService.getToken();
  }

  clearStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

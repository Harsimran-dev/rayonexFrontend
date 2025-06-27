import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from 'src/app/models/login';
import { environment } from 'src/app/enum/environment';
 // ✅ import environment

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private basicUrl = `${environment.apiUrl}api/v1/auth`; // ✅ dynamic base URL

  constructor(private http: HttpClient) { }

  signup(signupData: any): Observable<any> {
    return this.http.post<any>(`${this.basicUrl}/pension/signup`, signupData);
  }

  login(loginData: Login): Observable<any> {
    return this.http.post<any>(`${this.basicUrl}/pension/login`, loginData);
  }

  verifyCode(email: string, code: string): Observable<any> {
    const data = { email, code };
    return this.http.post<any>(`${this.basicUrl}/pension/verify`, data);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.basicUrl}/pension/users`);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.basicUrl}/pension/${userId}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  private baseUrl = 'http://localhost:8080/api/v1/user';
  private apiUrl = `${this.baseUrl}/user-details`;

  constructor(private http: HttpClient) { }

  createUserDetails(userDetails: any): Observable<any> {
    const url = `${this.apiUrl}/create`;
    const headers = this.createHeaders();
    return this.http.post<any>(url, userDetails, { headers });
  }

  getUserDetailsByUserId(userId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    const headers = this.createHeaders();
    return this.http.get<any>(url, { headers });
  }
  updateUserDetails(userId: number, userDetails: any): Observable<any> {
    const url = `${this.apiUrl}/${userId}/update`;
    const headers = this.createHeaders();
    return this.http.put<any>(url, userDetails, { headers });
  }

  private createHeaders(): HttpHeaders {
    const token = StoreService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}

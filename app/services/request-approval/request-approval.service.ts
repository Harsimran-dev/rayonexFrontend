import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class RequestApprovalService {

  private baseUrl = 'http://localhost:8080/api/v1/user';
  private apiUrl = `${this.baseUrl}/request-approval`;

  constructor(private http: HttpClient) { }

  getRequestApprovalByUserId(userId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    const headers = this.createHeaders();
    return this.http.get<any>(url, { headers });
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

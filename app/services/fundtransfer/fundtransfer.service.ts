import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class FundtransferService {

  private baseUrl = 'http://localhost:8080/api/v1/user/fund-transfer-history';

  constructor(private http: HttpClient) { }

  getFundTransferHistoryByUserId(userId: number): Observable<any[]> {
    const url = `${this.baseUrl}/user/${userId}`;
    const headers = this.createHeaders();
    return this.http.get<any[]>(url, { headers });
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private baseUrl = 'http://localhost:8080/api/v1/user/investments';

  constructor(private http: HttpClient) { }

  updateInvestment(investmentId: number, currentPrice: number): Observable<any> {
    const params = new HttpParams()
      .set('investmentId', investmentId.toString())
      .set('currentPrice', currentPrice.toString());
    const headers = this.createHeaders();
  
    return this.http.put(`${this.baseUrl}/update`, null, { params, headers });
  }
  

  transferProfitToPot(investmentId: number, pensionPotId: number): Observable<any> {
    const headers = this.createHeaders();
    return this.http.put(`${this.baseUrl}/transfer-profit-to-pot/${investmentId}/${pensionPotId}`, {}, { headers, responseType: 'text' });
  }
  

  getAllInvestmentsForUserr(userId: number): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${this.baseUrl}/compliance/user/${userId}`, { headers });
  }

  getAllInvestmentsForUser(userId: number): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${this.baseUrl}/user/${userId}/investments`, { headers });
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

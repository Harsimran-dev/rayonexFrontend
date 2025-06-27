import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class PensionpotService {

  private baseUrl = 'http://localhost:8080/api/v1/user';
  private apiUrl = `${this.baseUrl}/pension-pot`;

  constructor(private http: HttpClient) { }

  getPensionPotsByUserId(userId: number): Observable<any> {
    const url = `${this.apiUrl}/user/${userId}`;
    const headers = this.createHeaders();
    return this.http.get<any>(url, { headers });
  }

  createPensionPot(pensionPotDto: any): Observable<any> {
    const url = `${this.apiUrl}/create`;
    const headers = this.createHeaders();
    return this.http.post<any>(url, pensionPotDto, { headers });
  }

  transferFunds(senderId: number, receiverId: number, amount: number): Observable<any> {
    const url = `${this.apiUrl}/transfer?senderId=${senderId}&receiverId=${receiverId}&amount=${amount}`;
    const headers = this.createHeaders();
    return this.http.put<any>(url, {}, { headers });
  }

  deletePensionPotById(id: number): Observable<any> {
    const url = `${this.baseUrl}/pension-pot/${id}`;
    const headers = this.createHeaders();
    return this.http.delete(url, { headers, responseType: 'text' });
  }

  private createHeaders(): HttpHeaders {
    const token = StoreService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getPensionPotById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const headers = this.createHeaders();
    return this.http.get<any>(url, { headers });
  }
}

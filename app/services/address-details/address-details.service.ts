import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class AddressDetailsService {

  private baseUrl = 'http://localhost:8080/api/v1/user';
  private apiUrl = `${this.baseUrl}/address`;

  constructor(private http: HttpClient) { }

  createAddressDetails(addressDetails: any, userId: number): Observable<any> {
    const headers = this.createHeaders();
    if (headers) {
      const url = `${this.apiUrl}/user/${userId}`;
      return this.http.post<any>(url, addressDetails, { headers });
    } else {
      console.error('Authorization token not found.');
      throw new Error('Authorization token not found.');
    }
  }

  getAddressFromUser(userId: number): Observable<any> {
    const headers = this.createHeaders();
    if (headers) {
      const url = `${this.apiUrl}/user/${userId}`;
      return this.http.get<any>(url, { headers });
    } else {
      console.error('Authorization token not found.');
      throw new Error('Authorization token not found.');
    }
  }

  updateAddress(addressId: number, addressDetails: any): Observable<any> {
    const headers = this.createHeaders();
    if (headers) {
      const url = `${this.apiUrl}/${addressId}`;
      return this.http.put<any>(url, addressDetails, { headers });
    } else {
      console.error('Authorization token not found.');
      throw new Error('Authorization token not found.');
    }
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

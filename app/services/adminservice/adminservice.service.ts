import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreService } from '../store/store.service';
import { Company } from 'src/app/models/Company';
import { environment } from 'src/app/enum/environment'; // ✅ Import environment

@Injectable({
  providedIn: 'root'
})
export class AdminserviceService {

  private baseUrl = `${environment.apiUrl}api/v1/admin`; // ✅ Dynamic URL

  constructor(private http: HttpClient, private storeService: StoreService) { }

  getAllUsers(): Observable<any[]> {
    const headers = this.createHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/users`, { headers });
  }

  createCompany(name: string, type: string): Observable<string> {
    console.log(name);
    console.log(type);
    const headers = this.createHeaders();
    return this.http.post(`${this.baseUrl}/company/create/${name}/${type}`, null, {
      headers,
      responseType: 'text'
    });
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from 'src/app/models/Message';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class MessageserviceService {

  private baseUrl = 'http://localhost:8080/api/v1/user/message';

  constructor(private http: HttpClient) { }

  addMessage(message: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<string>(`${this.baseUrl}/add`, message, { headers });
  }

  getMessagesByUserId(userId: number): Observable<Message[]> {
    const headers = this.createHeaders();
    return this.http.get<Message[]>(`${this.baseUrl}/${userId}`, { headers });
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

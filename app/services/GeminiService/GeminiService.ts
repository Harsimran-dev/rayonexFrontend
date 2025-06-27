import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = 'http://localhost:8080/api/gemini/generate-content'; // Adjust URL if needed

  constructor(private http: HttpClient) {}

  getGeneratedContent(word: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?word=${word}`);
  }
}

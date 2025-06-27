import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/enum/environment';  // Import environment

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = `${environment.apiUrl}api/gemini/generate-content`;  // Dynamic base URL

  constructor(private http: HttpClient) {}

  getGeneratedContent(word: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?word=${word}`);
  }
}

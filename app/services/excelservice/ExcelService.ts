import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private apiUrl = 'http://localhost:8080/api/excel';  // Full URL to the backend API

  constructor(private http: HttpClient) {}

  // Method to get the Excel record by rahId
  getExcelRecordByRahId(rahId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/findByRahId?rahId=${rahId}`);
  }

  searchExcelRecordsByRahId(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/searchByRahId?query=${query}`);
  }
  
}

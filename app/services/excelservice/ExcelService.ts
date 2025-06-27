import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/enum/environment'; // ✅ Import environment

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private apiUrl = `${environment.apiUrl}api/excel`;  // ✅ Use dynamic base URL

  constructor(private http: HttpClient) {}

  getExcelRecordByRahId(rahId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/findByRahId?rahId=${rahId}`);
  }

  searchExcelRecordsByRahId(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/searchByRahId?query=${query}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private baseUrl = 'http://localhost:8080/api/v1/user';
  private apiUrlGetAllCompanies = `${this.baseUrl}/companies/all`;
  private apiUrlPostJob = `${this.baseUrl}/jobs/user`;
  private apiUrlGetJobsByUserId = `${this.baseUrl}/jobs/user`;
  private apiUrlUpdateJob = `${this.baseUrl}/jobs`;
  private apiUrlGetCompanyById = `${this.baseUrl}/companies`;

  constructor(private http: HttpClient) { }

  getAllCompanies(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get<any>(this.apiUrlGetAllCompanies, { headers });
  }

  postJob(jobData: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(this.apiUrlPostJob, jobData, { headers });
  }

  getJobsByUserId(userId: number): Observable<any> {
    const url = `${this.apiUrlGetJobsByUserId}/${userId}`;
    const headers = this.createHeaders();
    return this.http.get<any>(url, { headers });
  }

  updateJob(jobId: number, jobData: any): Observable<any> {
    const url = `${this.apiUrlUpdateJob}/${jobId}`;
    const headers = this.createHeaders();
    return this.http.put<any>(url, jobData, { headers });
  }

  getCompanyById(companyId: number): Observable<any> {
    const url = `${this.apiUrlGetCompanyById}/${companyId}`;
    const headers = this.createHeaders();
    return this.http.get<any>(url, { headers });
  }

  getCompanyTypeByUserId(userId: number): Observable<any> {
    const url = `${this.baseUrl}/companies/companyType/${userId}`;
    const headers = this.createHeaders();
    return this.http.get(url, { responseType: 'text', observe: 'response', headers }).pipe(
      map((response: any) => {
        return response.body;
      })
    );
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

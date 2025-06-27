import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TreatmentPlanItem } from './treatment-plan-item.service';

export interface TreatmentPlan {
  id?: number;
  date?: string;
  clientId: number;
  rahDescription: string;
  closeRecord: boolean;
  rayostanUhedIstPath?: string;
  rayoscin40ReportPath?: string;
  treatmentPlanItems?: TreatmentPlanItem[];
}

@Injectable({
  providedIn: 'root'
})
export class TreatmentPlanService {
  private baseUrl = 'http://localhost:8080/api/treatment-plans';

  constructor(private http: HttpClient) {}

  uploadTreatmentPlan(
    clientId: number,
    rayostanUhedIst: File,
    rayoscin40Report: File,
    rahDescription: string,
    closeRecord: boolean
  ): Observable<TreatmentPlan> {
    const formData = new FormData();
    formData.append('clientId', clientId.toString());
    formData.append('rayostanUhedIst', rayostanUhedIst);
    formData.append('rayoscin40Report', rayoscin40Report);
    formData.append('rahDescription', rahDescription);
    formData.append('closeRecord', String(closeRecord));

    return this.http.post<TreatmentPlan>(`${this.baseUrl}/upload`, formData);
  }

  getTreatmentPlansByClientId(clientId: number): Observable<TreatmentPlan[]> {
    return this.http.get<TreatmentPlan[]>(`${this.baseUrl}/client/${clientId}`);
  }

  downloadRayoscin40Report(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/rayoscin40`, {
      responseType: 'blob'
    });
  }
  getTreatmentPlanById(id: number): Observable<TreatmentPlan> {
    return this.http.get<TreatmentPlan>(`${this.baseUrl}/${id}`);
  }

  updateCloseRecordStatus(id: number, closeRecord: boolean): Observable<TreatmentPlan> {
    const params = new HttpParams().set('closeRecord', String(closeRecord));
    return this.http.put<TreatmentPlan>(`${this.baseUrl}/${id}/close-record`, null, { params });
  }
  
  

  downloadRayostanUhedIst(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/rayostan-uhed-ist`, {
      responseType: 'blob'
    });
  }

  createEmptyTreatmentPlan(clientId: number): Observable<TreatmentPlan> {
    const formData = new FormData();
    formData.append('clientId', clientId.toString());
    formData.append('rahDescription', '');
    formData.append('closeRecord', 'false');
  
    // Dummy PDF files (empty blobs)
    const emptyBlob = new Blob([''], { type: 'application/pdf' });
    formData.append('rayostanUhedIst', emptyBlob, 'empty.pdf');
    formData.append('rayoscin40Report', emptyBlob, 'empty.pdf');
  
    return this.http.post<TreatmentPlan>(`${this.baseUrl}/upload`, formData);
  }

  updateRahDescription(id: number, newDescription: string): Observable<TreatmentPlan> {
    return this.http.put<TreatmentPlan>(
      `${this.baseUrl}/${id}/description`,
      newDescription,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  
}

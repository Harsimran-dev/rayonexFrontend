import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TreatmentPlanItem {
  id?: number;
  treatmentType: string;
  date: string;
  time: string;
  completed: boolean;
  close: boolean;
  pdfResults?: Blob | null;
  treatmentPlan?: {
    id: number;
  };
  pdfUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TreatmentPlanItemService {

  private baseUrl = 'http://localhost:8080/api/treatment-plan-items';

  constructor(private http: HttpClient) {}

  // ✅ Get all items
  getAllItems(): Observable<TreatmentPlanItem[]> {
    return this.http.get<TreatmentPlanItem[]>(this.baseUrl);
  }

  // ✅ Get item by ID
  getItemById(id: number): Observable<TreatmentPlanItem> {
    return this.http.get<TreatmentPlanItem>(`${this.baseUrl}/${id}`);
  }

  // ✅ Get items by treatment plan ID
  getItemsByTreatmentPlanId(planId: number): Observable<TreatmentPlanItem[]> {
    return this.http.get<TreatmentPlanItem[]>(`${this.baseUrl}/plan/${planId}`);
  }

  // ✅ Save single item
  saveItem(item: TreatmentPlanItem): Observable<TreatmentPlanItem> {
    return this.http.post<TreatmentPlanItem>(this.baseUrl, item);
  }

  // ✅ Save multiple items (bulk)
  saveMultipleItems(items: TreatmentPlanItem[]): Observable<TreatmentPlanItem[]> {
    return this.http.post<TreatmentPlanItem[]>(`${this.baseUrl}/bulk`, items);
  }

  // ✅ Delete item
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ✅ Upload a single item with file
uploadItem(item: TreatmentPlanItem, treatmentPlanId: number): Observable<TreatmentPlanItem> {
  const formData = new FormData();
  formData.append('treatmentType', item.treatmentType);
  formData.append('date', item.date);
  formData.append('time', item.time);
  formData.append('completed', String(item.completed));
  formData.append('close', String(item.close));
  formData.append('treatmentPlanId', treatmentPlanId.toString());

  if (item.pdfResults) {
    formData.append('pdfFile', item.pdfResults);
  }

  return this.http.post<TreatmentPlanItem>(`${this.baseUrl}/upload`, formData);
}
// Add this to the existing service
updateItem(id: number, item: TreatmentPlanItem): Observable<TreatmentPlanItem> {
  const formData = new FormData();
  formData.append('treatmentType', item.treatmentType);
  formData.append('date', item.date);
  formData.append('time', item.time);
  formData.append('completed', String(item.completed));
  formData.append('close', String(item.close));

  if (item.pdfResults) {
    formData.append('pdfFile', item.pdfResults);
  }

  return this.http.put<TreatmentPlanItem>(`${this.baseUrl}/${id}`, formData);
}



}

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PdfDataService {
  private pdfBase64Data: string | null = null;

  setPdfData(base64: string) {
 
    this.pdfBase64Data = base64;
  }

  getPdfData(): string | null {
    return this.pdfBase64Data;
  }

  clear() {
    this.pdfBase64Data = null;
  }
}

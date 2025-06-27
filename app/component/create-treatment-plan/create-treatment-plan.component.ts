import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PdfDataService } from 'src/app/services/pdf-data.service';
import { TabSwitchService } from 'src/app/services/tab-switch.service';
import { TreatmentPlanItemService, TreatmentPlanItem } from 'src/app/services/treatment-plan-item.service';
import { TreatmentPlanService } from 'src/app/services/treatment-plan.service';

@Component({
  selector: 'app-create-treatment-plan',
  templateUrl: './create-treatment-plan.component.html',
  styleUrls: ['./create-treatment-plan.component.scss']
})
export class CreateTreatmentPlanComponent implements OnInit {

  @Input() clientId!: number;
  @Input() firstName!: string;
  @Input() surname!: string;
  @Input() dateOfBirth!: string;
  @Input() treatmentPlanId!: number | null;
  @Input() prefilledItems?: TreatmentPlanItem[];

  treatmentItems: any[] = [{
    treatmentType: '',
    date: '',
    time: '',
    completed: false,
    pdfFile: null,
    pdfUrl: null
  }];

  treatmentTypeOptions: string[] = [
    "Rayoscan Check List", "Rayoscan Detailed Scan", "Rayoscan Treatment Plan",
    "BaPS Range Value Test", "BaPS scan", "Compact Program", "Energy Treatment",
    "BaPS treatment Plan", "Progress Report", "Detox Program", "Allergen Test",
    "Rayotensor manual treatment", "Acupuncture treatment", "Weight Loss Program",
    "Rayotensor manual Analysis", "Add New"
  ];

  constructor(
    private tabSwitchService: TabSwitchService ,
    private itemService: TreatmentPlanItemService,
    private treatmentPlanService: TreatmentPlanService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private pdfDataService: PdfDataService
  ) {}

  ngOnInit(): void {
    if (this.prefilledItems?.length) {
      this.treatmentItems = this.prefilledItems.map(item => ({
        id: item.id,
        treatmentType: item.treatmentType,
        date: item.date,
        time: item.time,
        completed: item.completed,
        close: item.close,
        pdfFile: item.pdfResults,
        pdfUrl: typeof item.pdfResults === 'string'
          ? this.getSafePdfUrl(item.pdfResults)
          : null
      }));
    }

    const base64Pdf = this.pdfDataService.getPdfData();
console.log("Received PDF base64 in CreateTreatmentPlan:", base64Pdf);
  }

  addRow() {
    this.treatmentItems.push({
      treatmentType: '',
      date: '',
      time: '',
      completed: false,
      close: false,
      pdfFile: null,
      pdfUrl: null
    });
  }

  handleFileInput(event: any, index: number) {
    const file = event.target.files[0];
    this.treatmentItems[index].pdfFile = file;
    this.treatmentItems[index].pdfUrl = null;
  }

  viewPDF(item: any) {
    if (item.treatmentType === 'Rayoscan Check List' && item.pdfFile) {
      this.pdfDataService.setPdfData(item.pdfFile);
      this.tabSwitchService.switchToTab(2); // ⬅ Switch to Analysis tab
    }
  }
  

  convertBase64ToBlob(base64: string, contentType = 'application/pdf'): Blob {
    const byteCharacters = atob(base64.replace(/^data:application\/pdf;base64,/, ''));
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    return new Blob([new Uint8Array(byteNumbers)], { type: contentType });
  }

  getSafePdfUrl(base64: string): SafeResourceUrl {
    const blob = this.convertBase64ToBlob(base64);
    const url = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  closeTreatmentPlanRecord() {
    if (!this.treatmentPlanId) {
      console.error('Treatment plan ID is not available.');
      return;
    }
  
    this.treatmentPlanService.updateCloseRecordStatus(this.treatmentPlanId, true).subscribe({
      next: (updatedPlan) => {
        console.log('Record closed successfully:', updatedPlan);
        // Optionally redirect or show a success message
        alert('Treatment record closed successfully.');
      },
      error: (error) => {
        console.error('Failed to close record:', error);
        alert('Failed to close the record. Please try again.');
      }
    });
  }
  

  submitTreatmentPlan() {
    const formData = new FormData();
    formData.append('clientId', this.clientId.toString());
    formData.append('rahDescription', '');
    formData.append('closeRecord', 'false');

    const emptyBlob = new Blob([''], { type: 'application/pdf' });
    formData.append('rayostanUhedIst', emptyBlob, 'empty.pdf');
    formData.append('rayoscin40Report', emptyBlob, 'empty.pdf');

    const processItems = (planId: number) => {
      for (let item of this.treatmentItems) {
        const treatmentItem: TreatmentPlanItem = {
          id: item.id,
          treatmentType: item.treatmentType,
          date: item.date,
          time: item.time,
          completed: item.completed,
          close: item.close,
          pdfResults: item.pdfFile
        };

        const action = treatmentItem.id
          ? this.itemService.updateItem(treatmentItem.id, treatmentItem)
          : this.itemService.uploadItem(treatmentItem, planId);

        action.subscribe({
          next: res => console.log('Item saved:', res),
          error: err => console.error('Error saving item:', err)
        });
      }
    };

    if (this.treatmentPlanId) {
      processItems(this.treatmentPlanId);
    } else {
      this.treatmentPlanService.createEmptyTreatmentPlan(this.clientId).subscribe({
        next: (plan: any) => {
          this.treatmentPlanId = plan.id;
          processItems(plan.id);
        },
        error: err => console.error('Plan creation failed:', err)
      });
    }
  }
}

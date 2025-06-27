import { Component, Input, OnInit } from '@angular/core';
import { HealthPrograms } from 'src/app/enum/HealthPrograms';
import { TreatmentPlanService, TreatmentPlan } from 'src/app/services/treatment-plan.service';


@Component({
  selector: 'app-treatment-record',
  templateUrl: './treatment-record.component.html',
  styleUrls: ['./treatment-record.component.scss']
})
export class TreatmentRecordComponent implements OnInit {

  @Input() clientId!: number;
  @Input() firstName!: string;
  @Input() surname!: string;
  @Input() dateOfBirth!: string;

  showCreateForm: boolean = false;
  treatmentPlans: TreatmentPlan[] = [];
  selectedPlanId: number | null = null;
  selectedPlanItems: any[] = [];

  // 👇 List of all enum values to bind in dropdown
  healthProgramOptions: string[] = Object.values(HealthPrograms);

  constructor(private treatmentPlanService: TreatmentPlanService) {}

  ngOnInit(): void {
    this.fetchTreatmentPlans();
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  viewPlan(planId: number): void {
    this.treatmentPlanService.getTreatmentPlanById(planId).subscribe({
      next: (plan) => {
        this.selectedPlanId = plan.id!;
        this.selectedPlanItems = plan.treatmentPlanItems || [];
        this.showCreateForm = true;
      },
      error: err => console.error('Failed to load treatment plan by ID', err)
    });
  }

  fetchTreatmentPlans(): void {
    if (this.clientId) {
      this.treatmentPlanService.getTreatmentPlansByClientId(this.clientId).subscribe({
        next: plans => this.treatmentPlans = plans,
        error: err => console.error('Error fetching treatment plans', err)
      });
    }
  }

  updateDescription(plan: TreatmentPlan): void {
    if (!plan.id || !plan.rahDescription) return;

    this.treatmentPlanService.updateRahDescription(plan.id, plan.rahDescription).subscribe({
      next: updated => {
        console.log('Description updated:', updated);
      },
      error: err => {
        console.error('Failed to update description:', err);
      }
    });
  }
}

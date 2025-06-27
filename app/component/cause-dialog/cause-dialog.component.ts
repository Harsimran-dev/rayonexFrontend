import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cause-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data.cause }}</h2>
      <mat-dialog-content>
        <p class="title">Extracted Causes:</p>
        <ul class="cause-list">
          <li *ngFor="let item of data.codes">
            <span class="code">{{ item.code }}</span>
            <span class="name">{{ item.name }}</span>
            <span class="percentage">{{ item.percentage }}%</span>
          </li>
        </ul>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button color="primary" (click)="close()">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      max-width: 400px;
      min-width: 300px;
      padding: 16px;
    }
    .title {
      font-weight: bold;
      margin-bottom: 8px;
    }
    .cause-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .cause-list li {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #ddd;
    }
    .code {
      font-weight: bold;
      color: #1976d2;
    }
    .name {
      flex: 1;
      margin-left: 8px;
    }
    .percentage {
      font-weight: bold;
      color: #d32f2f;
    }
    mat-dialog-actions {
      margin-top: 12px;
    }
  `]
})
export class CauseDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CauseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cause: string; codes: { code: string, name: string, percentage: number }[] }
  ) {}

  close() {
    this.dialogRef.close();
  }
}

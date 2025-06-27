import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import {NgxPrintModule} from 'ngx-print';
import { MatTabsModule } from '@angular/material/tabs';
import { NgChartsModule } from 'ng2-charts';



import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule




import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsRoutes } from './component.routing';
import { PersonaldetailsComponent } from './personaldetails/personaldetails/personaldetails.component';


import { NgxLoadingModule } from "ngx-loading";



import { NgImageSliderModule } from 'ng-image-slider';

import { WordReaderComponent } from './word-reader/word-reader.component';
import { CauseDialogComponent } from './cause-dialog/cause-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientAppointmentsComponent } from './client-appointments/client-appointments.component';
import { TreatmentRecordComponent } from './treatment-record/treatment-record.component';
import { MatIconModule } from '@angular/material/icon';
import { CreateTreatmentPlanComponent } from './create-treatment-plan/create-treatment-plan.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { PitComponent } from './pit/pit.component';
















@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgImageSliderModule,
    NgxPrintModule,
    NgChartsModule,
    MatButtonModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
  
    MatCardModule,
    MatDialogModule,
    HttpClientModule,
    MatIconModule,

  

    NgApexchartsModule,
    NgxLoadingModule.forRoot({})

  
  ],
  declarations: [

  

  
    PersonaldetailsComponent,
     

       
     
    
            ClientFormComponent,
        
            WordReaderComponent,
            CauseDialogComponent,
            ClientDetailsComponent,
            ClientAppointmentsComponent,
            TreatmentRecordComponent,
            CreateTreatmentPlanComponent,
            PitComponent
      

        
       
         
     
       
    
  ],
})
export class ComponentsModule { }

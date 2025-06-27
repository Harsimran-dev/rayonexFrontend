import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientServiceService } from 'src/app/services/client-service.service';
import { Client } from 'src/app/models/Client';
import { AppointmentService } from 'src/app/services/appointment.service';
import { TreatmentRecordComponent } from '../treatment-record/treatment-record.component';
import { TabSwitchService } from 'src/app/services/tab-switch.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
 
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {

  clientId!: number;
  client!: Client;
  appointments: any[] = [];
newAppointmentDate: string = '';
selectedIndex = 0;  // Optional: track active tab


  constructor(
    private tabSwitchService: TabSwitchService,
    private route: ActivatedRoute,
    private clientService: ClientServiceService,
    private appointmentService: AppointmentService 
  ) { }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.params['id'];
    this.fetchClientDetails();
    this.fetchAppointments();
    this.tabSwitchService.tabChange$.subscribe(index => {
      this.selectedIndex = index;
    });
  }
  goToAnalysisTab() {
    this.selectedIndex = 2; // "Analysis" tab is index 2
  }
  fetchClientDetails() {
    this.clientService.getClientById(this.clientId).subscribe({
      next: (clientData) => {
        this.client = clientData;
      },
      error: (error) => {
        console.error('Error fetching client details:', error);
      }
    });
  }

  fetchAppointments() {
    this.appointmentService.getAppointmentsByClientId(this.clientId).subscribe({
      next: (data) => {
        this.appointments = data;
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
      }
    });
  }
  


  
}

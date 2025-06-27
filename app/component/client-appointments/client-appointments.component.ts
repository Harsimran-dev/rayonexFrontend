import { Component, Input, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-client-appointments',
  templateUrl: './client-appointments.component.html',
  styleUrls: ['./client-appointments.component.scss']
})
export class ClientAppointmentsComponent implements OnInit {

  @Input() clientId!: number;

  appointments: Appointment[] = [];
  newAppointmentDate: string = '';
  newAppointmentDuration: number | null = null; // <-- duration input

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    if (this.clientId) {
      this.fetchAppointments();
    }
  }

  fetchAppointments() {
    this.appointmentService.getAppointmentsByClientId(this.clientId).subscribe({
      next: data => this.appointments = data,
      error: err => console.error('Error loading appointments:', err)
    });
  }

  createAppointment() {
    const appointment = {
      date: this.newAppointmentDate,
      duration: this.newAppointmentDuration,
      clientId: this.clientId
    };

    this.appointmentService.createAppointment(appointment).subscribe({
      next: created => {
        this.appointments.push(created);
        this.newAppointmentDate = '';
        this.newAppointmentDuration = null;
      },
      error: err => console.error('Failed to create appointment:', err)
    });
  }
}

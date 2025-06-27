import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientServiceService } from 'src/app/services/client-service.service';
import { Client } from 'src/app/models/Client'; // Adjust the import path as needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {

  clientForm: FormGroup;
  clients: Client[] = [];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientServiceService,
    private router: Router 
  ) {
    this.clientForm = this.fb.group({
      title: ['', Validators.required],
      gender: ['', Validators.required],
      firstName: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.maxLength(255)],
      postCode: ['', [Validators.pattern('^[A-Za-z0-9]{2,10}$')]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern('^[0-9]{10}$')]],
      mobile: ['', [Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit(): void {
    // Fetch all clients from the backend
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
      }
    });
  }

  viewClientDetails(clientId: number) {
    this.router.navigate(['component/client-details', clientId]);
  }

  onSubmit() {
    if (this.clientForm.valid) {
      const client: Client = this.clientForm.value;
      this.clientService.addClient(client).subscribe({
        next: (response) => {
          console.log('✅ Client added successfully:', response);
          this.clientForm.reset();
          this.clients.push(response); // Add the newly added client to the list
        },
        error: (error) => {
          console.error('❌ Error adding client:', error);
        }
      });
    }
  }
}

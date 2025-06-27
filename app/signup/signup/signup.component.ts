import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form!: FormGroup;
  passwordVisible = false;
  errorAlertVisible = false;
  passwordFieldType = 'password';
  successAlertVisible = false;
  isSubmitting = false;
  meter!: number
  errorMessage: string = '';
  passwordAlertVisible = false;
  backendErrorResponse: any;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', Validators.required],
      role: ['USER'],
      mfaEnabled: [true]
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }

  onSubmit(): void {
    if (this.form.valid && this.meter === 4) {
      this.isSubmitting = true;
  
      this.authService.signup(this.form.value).subscribe(response => {
        this.successAlertVisible = true;
        this.router.navigate(['/googleqr'], { state: { response: response } });
      }, err => {
        if (err instanceof HttpErrorResponse && err.status === 400) {
          this.errorMessage = err.error;
          this.errorAlertVisible = true;
        } else {
          this.errorMessage = 'An unexpected error occurred';
          this.errorAlertVisible = true;
        }
      }).add(() => {
        this.isSubmitting = false;
      });
    } else {
      this.form.markAllAsTouched();
      console.log("not correct")
  
      if (this.meter !== 4) {
        this.passwordAlertVisible = true;
      }
    }
  }
  

  onStrengthChange(score: number) {
    this.meter = score;
  }
}

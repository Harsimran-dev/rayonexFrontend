import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-googleqr',
  templateUrl: './googleqr.component.html',
  styleUrls: ['./googleqr.component.scss']
})
export class GoogleqrComponent implements OnInit {
  responseData: any;
  validationCode!: string;
  verificationResponse: string | null = null;
  errorAlertVisible = false;
  sixdigitAlertVisible = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.responseData = history.state.response;

    if (!this.responseData || !this.responseData.qrCodeUri) {
      console.error('QR code data not found');
    }
  }

  submitCode(): void {
    if (!this.validationCode || this.validationCode.length !== 6) {
      this.sixdigitAlertVisible=true;
      console.error('Validation code should be a 6-digit number');
      
      return;
    }

    const email = this.responseData.email;

    this.authService.verifyCode(email, this.validationCode).subscribe(
      response => {
        console.log('Validation code verification response:', response);
        
    
        this.router.navigate(['/login'], { state: { response } });
      },
      error => {
        console.error('Error verifying validation code:', error);
    
        if (error instanceof HttpErrorResponse && error.status === 400) {
          this.errorMessage = error.error;
          this.errorAlertVisible = true;
        } else {
          this.errorMessage = 'An unexpected error occurred';
          this.errorAlertVisible = true;
        }
      }
    );
  }
}

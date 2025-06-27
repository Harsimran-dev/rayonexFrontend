import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { StoreService } from 'src/app/services/store/store.service';

@Component({
  selector: 'app-verifypage',
  templateUrl: './verifypage.component.html',
  styleUrls: ['./verifypage.component.scss']
})
export class VerifypageComponent {

  responseData: any;
  validationCode!: string;
  verificationResponse: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.responseData = history.state.response;
    console.log( this.responseData);

    
  }


  submitCode(): void {
    if (!this.validationCode || this.validationCode.length !== 6) {
      console.error('Validation code should be a 6-digit number');
      return;
    }

    const email = this.responseData.email;

    this.authService.verifyCode(email, this.validationCode).subscribe(
      response => {StoreService.saveToken(response.jwt);
        StoreService.saveUser(response);
        if (StoreService.isAdminLoggedIn()) {
          this.router.navigateByUrl('/admin/useradmin', { state: { user: response } });
        }
        else{
          
        }
  
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl, { state: { user: response } });
     
      },
      error => {
        console.error('Error verifying validation code:', error);
      }
    );
  }

}

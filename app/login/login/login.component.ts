import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Login } from 'src/app/models/login';
import { StoreService } from 'src/app/services/store/store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorAlertVisible = false;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get form() { return this.loginForm.controls; }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting) {
      return;
    }
  
    this.isSubmitting = true;
  
    const loginData: Login = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };
  
    this.authService.login(loginData).subscribe(
      response => {
        console.log('Login successful:', response);
        console.log(response.userRole);
        if (response.userRole === 'ADMIN') {
          StoreService.saveToken(response.jwt);
        StoreService.saveUser(response);
     

          this.router.navigateByUrl('/admin/useradmin', { state: { user: response } });
        }
        else{
          this.router.navigate(['/verify'], { state: { response: response } });

        }
   
    
        
  
      },
      error => {
        console.error('Login failed:', error);
        this.errorAlertVisible = true;
      }
    ).add(() => {
      this.isSubmitting = false;
    });
  }
  
}
  

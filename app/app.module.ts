import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule, LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';









import { NavigationComponent } from './shared/header/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';
import { SignupLayoutComponent } from './layouts/signup-layout/signup-layout.component';
import { SignupComponent } from './signup/signup/signup.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SelectDropDownModule } from 'ngx-select-dropdown'







import { StrengthMeterModule } from '@eisberg-labs/ngx-strength-meter';
import { GoogleqrComponent } from './googleqr/googleqr/googleqr.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { LoginComponent } from './login/login/login.component';
import { FullLayoutComponent } from './layouts/full/fulllayout.component';
import { VerifypageComponent } from './verifypage/verifypage/verifypage.component';













@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    SignupLayoutComponent,
    SignupComponent,
    GoogleqrComponent,
    LoginComponent,
    VerifypageComponent,
   
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,


    FormsModule,
    SelectDropDownModule,
 




  
   
    ReactiveFormsModule,
    QRCodeModule,
 
   
    
    StrengthMeterModule,
    

  
    HttpClientModule,

    NgbModule,
    RouterModule.forRoot(Approutes, { useHash: false}),
    FullLayoutComponent,
    NavigationComponent,
    SidebarComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

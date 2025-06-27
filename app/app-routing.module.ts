
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { SignupLayoutComponent } from './layouts/signup-layout/signup-layout.component';
import { SignupComponent } from './signup/signup/signup.component';
import { GoogleqrComponent } from './googleqr/googleqr/googleqr.component';
import { LoginComponent } from './login/login/login.component';
import { GuardService } from './services/guard/guard.service';
import { FullLayoutComponent } from './layouts/full/fulllayout.component';
import { VerifypageComponent } from './verifypage/verifypage/verifypage.component';


export const Approutes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    canActivate: [GuardService],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'component',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      }
    ]
  },
  {
    path: 'signup',
    component: SignupLayoutComponent,
    children: [
      { path: '', component: SignupComponent }
    ]
  },
  {
    path: 'googleqr',
    component: SignupLayoutComponent,
    children: [
      { path: '', component: GoogleqrComponent }
    ]
  },
  {
    path: 'login',
    component: SignupLayoutComponent,
    children: [
      { path: '', component: LoginComponent }
    ]
  },
  {
    path: 'verify',
    component: VerifypageComponent,
    children: [
      { path: '', component: VerifypageComponent }
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(Approutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


interface RouteInfo {
  path: string;
  title: string;
  icon: string;

  submenu: RouteInfo[];
}


import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';

import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgIf } from '@angular/common';
import { VerticalSidebarService } from './sidebar.service';
import { StoreService } from 'src/app/services/store/store.service';
import { JobService } from 'src/app/services/job/job.service';
import { ADMIN_ROUTES } from './admin-items';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports:[RouterModule, CommonModule, NgIf],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems:RouteInfo[]=[];
  sidebarRefreshed: boolean = false;
  adminSidebarnavItems: RouteInfo[] = ADMIN_ROUTES;
  
  MENUITEMS: RouteInfo[] = ROUTES;
  addExpandClass(element: string) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private verticalSidebarService: VerticalSidebarService,
    private jobService: JobService
  ) {}

  ngOnInit() {
   ;
    if ( StoreService.isAdminLoggedIn()) {
      this.loadAdminSidebar();
    } else {
      this.updateRoutes();
    }


  
   
   const sidebarRefreshedString = localStorage.getItem('sidebarRefreshed');
   if (sidebarRefreshedString !== null) {
     this.sidebarRefreshed = JSON.parse(sidebarRefreshedString);
   }
   if (!this.sidebarRefreshed) {
    this.loadSidebar();
  }
  

 

  
  }
  loadAdminSidebar(): void {
    this.sidebarnavItems = [...ADMIN_ROUTES];
    
  }


  loadSidebar() {
    setTimeout(() => {
      window.location.reload();
      this.sidebarRefreshed = true;
      localStorage.setItem('sidebarRefreshed', JSON.stringify(this.sidebarRefreshed));
    }, 500);
  }



  updateRoutes(): void {
    const userId = StoreService.getUserData().userId;
    this.jobService.getCompanyTypeByUserId(userId).subscribe(
      (companyTypeData: any) => {
        this.sidebarnavItems = [...this.verticalSidebarService.MENUITEMS];
        if (companyTypeData === 'defined_benefit') {
          console.log("1");
          this.removeRoute('Defined Contribution');
          this.removeRoute('My Investments');
          this.removeRoute('How To Invest');
    
        } else if (companyTypeData === 'defined_contribution') {
          console.log("2");
          this.removeRoute('Defined Benefit');
        } else {
          this.sidebarnavItems = [...ROUTES];
          console.log("3");
          this.removeRoute('Defined Contribution');
          this.removeRoute('Defined Benefit');
          this.removeRoute('My Investments');
        }
      },
      (error) => {
        this.sidebarnavItems = [...ROUTES];
        console.error('Error fetching company type:', error);
        this.removeRoute('Defined Contribution');
        this.removeRoute('Defined Benefit');
        this.removeRoute('My Investments');
      }
    );
  }

  private removeRoute(title: string): void {
    const index = this.sidebarnavItems.findIndex(item => item.title === title);
    if (index !== -1) {
      this.sidebarnavItems.splice(index, 1);
    }
  }
}

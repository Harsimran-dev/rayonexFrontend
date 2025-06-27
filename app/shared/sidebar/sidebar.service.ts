
interface RouteInfo {
  path: string;
  title: string;
  icon: string;

  submenu: RouteInfo[];
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ROUTES } from './menu-items';
import { JobService } from 'src/app/services/job/job.service';
import { StoreService } from 'src/app/services/store/store.service';

@Injectable({
  providedIn: 'root'
})
export class VerticalSidebarService {
  public screenWidth: any;
  public collapseSidebar: boolean = false;
  public fullScreen: boolean = false;
  sidebarRefreshed: boolean = false;
  MENUITEMS: RouteInfo[] = ROUTES;

  items = new BehaviorSubject<RouteInfo[]>(this.MENUITEMS);
  private dataReadySubject = new Subject<void>();

  constructor(
    private jobService: JobService,
    private storeService: StoreService
  ) {
    this.updateRoutes();
  }
  clearSidebarRefreshed(): void {
    localStorage.removeItem('sidebarRefreshed');
  }

  updateRoutes(): void {
    const userId = StoreService.getUserData().userId;
    this.jobService.getCompanyTypeByUserId(userId).subscribe(
      (companyTypeData: any) => {
        if (companyTypeData === 'defined_benefit') {
          console.log("1");
          this.removeRoute('Defined Contribution');
          this.removeRoute('My Investments');
        } else if (companyTypeData === 'defined_contribution') {
          console.log("2");
          this.removeRoute('Defined Benefit');
        } else {
          console.log("3");
          // Remove both routes if no company type data is found
          this.removeRoute('Defined Contribution');
          this.removeRoute('Defined Benefit');
          this.removeRoute('My Investments');
        }
        this.notifyDataReady(); // Notify subscribers that data is ready
      },
      (error) => {
        console.error('Error fetching company type:', error);
        // Remove both routes if there's an error fetching company type
        this.removeRoute('Defined Contribution');
        this.removeRoute('Defined Benefit');
        this.removeRoute('My Investments');
        this.notifyDataReady(); // Notify subscribers that data is ready even if there's an error
      }
    );
  }
  
  private notifyDataReady(): void {
    this.items.next([...this.MENUITEMS]);
  }
  
  
  private removeRoute(title: string): void {
    const index = this.MENUITEMS.findIndex(item => item.title === title);
    if (index !== -1) {
      this.MENUITEMS.splice(index, 1);
    }
  }
  
}

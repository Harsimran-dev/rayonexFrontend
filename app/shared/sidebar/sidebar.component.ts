
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
  
  ) {}

  ngOnInit() {
   ;
    if ( StoreService.isAdminLoggedIn()) {
      this.loadAdminSidebar();
    } else {
    
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



  private removeRoute(title: string): void {
    const index = this.sidebarnavItems.findIndex(item => item.title === title);
    if (index !== -1) {
      this.sidebarnavItems.splice(index, 1);
    }
  }
}

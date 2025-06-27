


import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from 'src/app/services/store/store.service';
import { UserDetailsService } from 'src/app/services/user-details/user-details.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { VerticalSidebarService } from '../sidebar/sidebar.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';



declare var $: any;

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit, OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  public showSearch = false;
  public userName!: string;
  name!: string;
  count!:number
  previousConversations: any[] = [];
  adminConversations: any[] = [];

  private inactivityTimeout: any;
  private readonly INACTIVITY_TIMEOUT_DURATION = 100000000000;

  constructor(

    private modalService: NgbModal,
    private router: Router,
    private authService: AuthenticationService,
    private storeService: StoreService,
    private userDetailsServie: UserDetailsService,
    private sidebarComponent: VerticalSidebarService
  ) {
    this.setupInactivityTimeout();
    this.resetInactivityTimeout();
  }

  ngOnInit() {
   
    this.authService.getUserById(StoreService.getUserData().userId).subscribe(
      (user: any) => {
        console.log('User:', user);
        this.userName = user.firstName;
      },
      (error) => {
        console.error('Error fetching user by ID:', error);
      }
    );

  
  }

  navigateToHelpPage(): void {
    console.log("clicked")
    this.router.navigate(['/component/help']);
  }
  navigateToprofilePage(): void {
    console.log("clicked")
    this.router.navigate(['/component/personal-details']);
  }
  navigateTopensionPage(): void {
    console.log("clicked")
    this.router.navigate(['/component/pension-pot']);
  }

  ngAfterViewInit() {
    window.addEventListener('mousemove', this.resetInactivityTimeout.bind(this));
    window.addEventListener('keypress', this.resetInactivityTimeout.bind(this));
    window.addEventListener('click', this.resetInactivityTimeout.bind(this));
  }

  resetInactivityTimeout(): void {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.logout();
    }, this.INACTIVITY_TIMEOUT_DURATION);
  }

  logout(): void {

    this.storeService.clearStorage();
    this.router.navigateByUrl('/login');
  }

  private setupInactivityTimeout(): void {
    this.inactivityTimeout = setTimeout(() => {
      this.logout();
    }, this.INACTIVITY_TIMEOUT_DURATION);
  }
}

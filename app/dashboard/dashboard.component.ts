import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StoreService } from 'src/app/services/store/store.service';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  user: any;
  hasContributions: boolean = false;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
   
  }
}

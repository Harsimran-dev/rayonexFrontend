
interface RouteInfo {
  path: string;
  title: string;
  icon: string;

  submenu: RouteInfo[];
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ROUTES } from './menu-items';

import { StoreService } from 'src/app/services/store/store.service';

@Injectable({
  providedIn: 'root'
})
export class VerticalSidebarService {

  
}

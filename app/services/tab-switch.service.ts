import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TabSwitchService {
  private tabChangeSubject = new Subject<number>();
  tabChange$ = this.tabChangeSubject.asObservable();

  switchToTab(index: number) {
    this.tabChangeSubject.next(index);
  }
}

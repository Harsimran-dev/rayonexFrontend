import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DefinedContribution } from 'src/app/models/definedcontribution';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _definedContributionSubject: BehaviorSubject<DefinedContribution | null> = new BehaviorSubject<DefinedContribution | null>(null);
  public readonly definedContribution$: Observable<DefinedContribution | null> = this._definedContributionSubject.asObservable();

  constructor() {}

  setDefinedContribution(definedContribution: DefinedContribution): void {
    this._definedContributionSubject.next(definedContribution);
  }
}

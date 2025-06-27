import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaldetailsComponent } from './personaldetails.component';

describe('PersonaldetailsComponent', () => {
  let component: PersonaldetailsComponent;
  let fixture: ComponentFixture<PersonaldetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonaldetailsComponent]
    });
    fixture = TestBed.createComponent(PersonaldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

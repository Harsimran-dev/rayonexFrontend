import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleqrComponent } from './googleqr.component';

describe('GoogleqrComponent', () => {
  let component: GoogleqrComponent;
  let fixture: ComponentFixture<GoogleqrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleqrComponent]
    });
    fixture = TestBed.createComponent(GoogleqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

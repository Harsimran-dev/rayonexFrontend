import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupLayoutComponent } from './signup-layout.component';

describe('SignupLayoutComponent', () => {
  let component: SignupLayoutComponent;
  let fixture: ComponentFixture<SignupLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupLayoutComponent]
    });
    fixture = TestBed.createComponent(SignupLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

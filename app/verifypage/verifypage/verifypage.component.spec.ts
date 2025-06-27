import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifypageComponent } from './verifypage.component';

describe('VerifypageComponent', () => {
  let component: VerifypageComponent;
  let fixture: ComponentFixture<VerifypageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifypageComponent]
    });
    fixture = TestBed.createComponent(VerifypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

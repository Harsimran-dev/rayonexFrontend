import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NocontributionComponent } from './nocontribution.component';

describe('NocontributionComponent', () => {
  let component: NocontributionComponent;
  let fixture: ComponentFixture<NocontributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NocontributionComponent]
    });
    fixture = TestBed.createComponent(NocontributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

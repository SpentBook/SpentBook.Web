import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookBtnLoginComponent } from './facebook-btn-login.component';

describe('FacebookBtnLoginComponent', () => {
  let component: FacebookBtnLoginComponent;
  let fixture: ComponentFixture<FacebookBtnLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookBtnLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookBtnLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

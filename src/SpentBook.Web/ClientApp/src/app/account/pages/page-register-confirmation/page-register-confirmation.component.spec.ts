import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRegisterConfirmationComponent } from './page-register-confirmation.component';

describe('PageRegisterConfirmationComponent', () => {
  let component: PageRegisterConfirmationComponent;
  let fixture: ComponentFixture<PageRegisterConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageRegisterConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRegisterConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

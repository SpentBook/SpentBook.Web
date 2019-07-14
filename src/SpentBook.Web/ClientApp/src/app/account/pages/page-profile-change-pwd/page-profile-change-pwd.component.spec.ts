import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageProfileChangePwdComponent } from './page-profile-change-pwd.component';

describe('PageProfileChangePwdComponent', () => {
  let component: PageProfileChangePwdComponent;
  let fixture: ComponentFixture<PageProfileChangePwdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageProfileChangePwdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageProfileChangePwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageUnregisterComponent } from './page-unregister.component';

describe('PageUnregisterComponent', () => {
  let component: PageUnregisterComponent;
  let fixture: ComponentFixture<PageUnregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageUnregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageUnregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

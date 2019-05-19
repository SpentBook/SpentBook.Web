import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxErrorComponent } from './box-error.component';

describe('BoxErrorComponent', () => {
  let component: BoxErrorComponent;
  let fixture: ComponentFixture<BoxErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

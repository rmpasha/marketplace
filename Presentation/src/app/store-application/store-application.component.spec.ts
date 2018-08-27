import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreApplicationComponent } from './store-application.component';

describe('StoreApplicationComponent', () => {
  let component: StoreApplicationComponent;
  let fixture: ComponentFixture<StoreApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

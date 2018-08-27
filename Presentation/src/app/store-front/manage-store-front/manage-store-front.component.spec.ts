import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStoreFrontComponent } from './manage-store-front.component';

describe('ManageStoreFrontComponent', () => {
  let component: ManageStoreFrontComponent;
  let fixture: ComponentFixture<ManageStoreFrontComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStoreFrontComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStoreFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

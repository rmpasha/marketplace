import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractOwnerComponent } from './contract-owner.component';

describe('ContractOwnerComponent', () => {
  let component: ContractOwnerComponent;
  let fixture: ComponentFixture<ContractOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

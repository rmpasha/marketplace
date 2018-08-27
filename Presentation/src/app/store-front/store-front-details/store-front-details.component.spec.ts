import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreFrontDetailsComponent } from './store-front-details.component';

describe('StoreFrontDetailsComponent', () => {
  let component: StoreFrontDetailsComponent;
  let fixture: ComponentFixture<StoreFrontDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreFrontDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreFrontDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { ContractOwnerComponent } from './contract-owner/contract-owner.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { StoreOwnerComponent } from './store-owner/store-owner.component';
import { ShopperComponent } from './shopper/shopper.component';
import { LoggingComponent } from './logging/logging.component';
import { StoreApplicationComponent } from './store-application/store-application.component';
import { AppRoutingModule } from './app-routing.module';

import { APP_BASE_HREF } from '@angular/common';
import { LoggingService } from './logging/logging.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ContractOwnerComponent,
        AdministratorComponent,
        StoreOwnerComponent,
        ShopperComponent,
        LoggingComponent,
        StoreApplicationComponent
      ],
      imports: [
        AppRoutingModule
      ],
      providers:[{provide: APP_BASE_HREF, useValue: '/'},LoggingService],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'Market Place'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Market Place');
  }));
  it('should render title in a nav tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('a.navbar-brand').textContent).toContain('Market Place');
  }));
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderOverviewPage } from './order-overview.page';

describe('OrderOverviewPage', () => {
  let component: OrderOverviewPage;
  let fixture: ComponentFixture<OrderOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderOverviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

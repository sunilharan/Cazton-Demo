import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderOverviewPageRoutingModule } from './order-overview-routing.module';
import { OrderOverviewPage } from './order-overview.page';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'src/app/components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderOverviewPageRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
  ],
  declarations: [OrderOverviewPage],
})
export class OrderOverviewPageModule {}

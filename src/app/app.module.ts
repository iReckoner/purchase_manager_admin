import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, ResetPasswordFormModule, CreateAccountFormModule, ChangePasswordFormModule, LoginFormModule } from './shared/components';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { UnauthenticatedContentModule } from './unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { ContactComponent } from './pages/contact/contact.component';
import { 
  DxDataGridModule, 
  DxFormModule, 
  DxButtonModule, 
  DxLoadPanelModule, 
  DxValidatorModule, 
  DxValidationSummaryModule, 
  DxTabPanelModule, 
  DxTabsModule, 
  DxChartModule, 
  DxPieChartModule, 
  DxSelectBoxModule, 
  DxNumberBoxModule, 
  DxCheckBoxModule, 
  DxSwitchModule, 
  DxRadioGroupModule,
  DxPopupModule,
  DxScrollViewModule,
  DxDateBoxModule,
  DxTagBoxModule
} from 'devextreme-angular';
import { ContactEditComponent } from './pages/contact-edit/contact-edit.component';
import { ResturantlinkageComponent } from './pages/resturantlinkage/resturantlinkage.component';
import { ResturantlinkageEditComponent } from './pages/resturantlinkage-edit/resturantlinkage-edit.component';
import { ReportComponent } from './pages/report/report.component';
import { PointstrackingreporttComponent } from './pages/pointstrackingreportt/pointstrackingreportt.component';
import { EventsComponent } from './pages/events/events.component';
import { EventsEditComponent } from './pages/events-edit/events-edit.component';
import { BannerComponent } from './pages/banner/banner.component';
import { PointconvreportComponent } from './pages/pointconvreport/pointconvreport.component';
import { HalloffameComponent } from './pages/halloffame/halloffame.component';
import { HofreportComponent } from './pages/hofreport/hofreport.component';
import { NewandhotComponent } from './pages/newandhot/newandhot.component';
import { NewandhoteditComponent } from './pages/newandhotedit/newandhotedit.component';
import { ChampPurchaserComponent } from './pages/champ-purchaser/champ-purchaser.component';
import { GrowthChampComponent } from './pages/growth-champ/growth-champ.component';
import { SkuRockstartComponent } from './pages/sku-rockstart/sku-rockstart.component';
import { HofeditComponent } from './pages/hofedit/hofedit.component';
import { GreenptsreportComponent } from './pages/greenptsreport/greenptsreport.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    ContactEditComponent,
    ResturantlinkageComponent,
    ResturantlinkageEditComponent,
    ReportComponent,
    PointstrackingreporttComponent,
    EventsComponent,
    EventsEditComponent,
    BannerComponent,
    PointconvreportComponent,
    HalloffameComponent,
    HofreportComponent,
    NewandhotComponent,
    NewandhoteditComponent,
    ChampPurchaserComponent,
    GrowthChampComponent,
    SkuRockstartComponent,
    HofeditComponent,
    GreenptsreportComponent
  ],
  imports: [
    BrowserModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    ResetPasswordFormModule,
    CreateAccountFormModule,
    ChangePasswordFormModule,
    LoginFormModule,
    UnauthenticatedContentModule,
    AppRoutingModule,
    DxDataGridModule,
    DxFormModule,
    DxButtonModule,
    DxLoadPanelModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxTabPanelModule,
    DxTabsModule,
    DxChartModule,
    DxPieChartModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxCheckBoxModule,
    DxSwitchModule,
    DxRadioGroupModule,
    DxPopupModule,
    DxScrollViewModule,
    DxDateBoxModule,
    DxTagBoxModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    ScreenService,
    AppInfoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

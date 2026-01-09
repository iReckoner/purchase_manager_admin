import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent, ResetPasswordFormComponent, CreateAccountFormComponent, ChangePasswordFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { DxDataGridModule, DxFormModule } from 'devextreme-angular';
import { ContactComponent } from './pages/contact/contact.component';
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

const routes: Routes = [
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'contact',
    component: ContactComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'contacts/new',
    component: ContactEditComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'contacts/edit/:id',
    component: ContactEditComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'hof/edit/:id',
    component: HofeditComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'resturantlinkages/edit/:id',
    component: ResturantlinkageEditComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'login-form',
    component: LoginFormComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent
  },
  {
    path: 'resturantlinkage',
    component: ResturantlinkageComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'report',
    component: ReportComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'pointstrackingreport',
    component: PointstrackingreporttComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'events',
    component: EventsComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'events/edit/:id',
    component: EventsEditComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'events/new',
    component: EventsEditComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'banner',
    component: BannerComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'pointconvreport',
    component: PointconvreportComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'halloffame',
    component: HalloffameComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'hofreport',
    component: HofreportComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'newandhot',
    component: NewandhotComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'newandhot/edit/:id',
    component: NewandhoteditComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'newandhot/new',
    component: NewandhoteditComponent ,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'champ-purchaser',
    component: ChampPurchaserComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'growth-champ',
    component: GrowthChampComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'sku-rockstar',
    component: SkuRockstartComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'greenptsreport',
    component: GreenptsreportComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    useHash: true,
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: 'enabled'
  }), DxDataGridModule, DxFormModule],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [
    HomeComponent,
    ProfileComponent,
    TasksComponent
  ]
})
export class AppRoutingModule { }

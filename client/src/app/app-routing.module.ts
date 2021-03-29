import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDisplayComponent } from './components/admin-display/admin-display.component';

import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { CategoryDisplayComponent } from './components/category-display/category-display.component';
import { ClientMainComponent } from './components/client-main/client-main.component';
import { DisplayComponent } from './components/display/display.component';
import { FormComponent } from './components/form/form.component';
import { IntroComponent } from './components/intro/intro.component';
import { LoginComponent } from './components/login/login.component';

import { OrderComponent } from './components/order/order.component';
import { Register1Component } from './components/register1/register1.component';
import { Register2Component } from './components/register2/register2.component';

import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { IsAdminGuard } from './guards/is-admin.guard';
import { OrderGardGuard } from './guards/order-gard.guard';
import { SignedInGuard } from './guards/signed-in.guard';
import { ThankyouGuard } from './guards/thankyou.guard';

const routes: Routes = [
  {
    path: 'intro', component: IntroComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register1', component: Register1Component },
      { path: 'register2', component: Register2Component },
      { path: 'welcome', canActivate: [SignedInGuard], component: WelcomeComponent }]
  },

  {
    path: 'clientmain', canActivate: [SignedInGuard], component: ClientMainComponent, children: [
      {
        path: 'display', canActivate: [SignedInGuard], component: DisplayComponent, children: [
          { path: 'displaybycategory', canActivate: [SignedInGuard], component: CategoryDisplayComponent }

        ]
      }
    ]
  },
  {
    path: 'adminmain', canActivate: [IsAdminGuard], component: AdminMainComponent, children: [

      {
        path: 'admindisplay', canActivate: [IsAdminGuard], component: AdminDisplayComponent, children: [
          { path: 'admindisplaybycategory', canActivate: [IsAdminGuard], component: CategoryDisplayComponent }

        ]
      }]
  }, { path: 'form', canActivate: [IsAdminGuard], component: FormComponent },
  { path: 'order', canActivate: [OrderGardGuard], component: OrderComponent },
  { path: 'thankyou', canActivate: [ThankyouGuard], component: ThankYouComponent },
  { path: '', redirectTo: 'intro/login', pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

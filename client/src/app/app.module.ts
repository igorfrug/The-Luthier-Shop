import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { IntroComponent } from './components/intro/intro.component';
import { Register1Component } from './components/register1/register1.component';
import { Register2Component } from './components/register2/register2.component';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { InfoComponent } from './components/info/info.component';
import { ClientMainComponent } from './components/client-main/client-main.component';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminDisplayComponent } from './components/admin-display/admin-display.component';
import { AddEditComponent } from './components/add-edit/add-edit.component';
import { OrderComponent } from './components/order/order.component';
import { FormComponent } from './components/form/form.component';
import { ReceiptComponent } from './components/receipt/receipt.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { DisplayComponent } from './components/display/display.component';
import { ItemComponent } from './components/item/item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CategoryDisplayComponent } from './components/category-display/category-display.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { InCartProductComponent } from './components/in-cart-product/in-cart-product.component';
import { AdminItemComponent } from './components/admin-item/admin-item.component';
import { ItemforeditingComponent } from './components/itemforediting/itemforediting.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { RecieptIremComponent } from './components/reciept-irem/reciept-irem.component'
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatBadgeModule } from '@angular/material/badge';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDividerModule } from '@angular/material/divider';
import { HighlightPipe } from './highlight.pipe';
import { MatToolbarModule } from '@angular/material/toolbar';
@NgModule({
  declarations: [

    AppComponent,
    HeaderComponent,
    IntroComponent,
    Register1Component,
    Register2Component,
    LoginComponent,
    AboutComponent,
    InfoComponent,
    ClientMainComponent,
    AdminMainComponent,
    CartComponent,
    AdminDisplayComponent,
    AddEditComponent,
    OrderComponent,
    FormComponent,
    ReceiptComponent,
    ThankYouComponent,
    DisplayComponent,
    ItemComponent,
    WelcomeComponent,
    CategoryDisplayComponent,
    InCartProductComponent,
    AdminItemComponent,
    ItemforeditingComponent,
    OrderFormComponent,
    RecieptIremComponent,
    HighlightPipe

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule,
    CommonModule,
    MatSidenavModule,
    MatExpansionModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatDividerModule,
    MatDialogModule,
    MatBadgeModule,
    MatToolbarModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-il' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(
    private http: HttpClient,
    public _data: DataService,
    public _sb: MatSnackBar) { }

  ///////AUTH & INFO/////////
  logIn(body) {
    return this.http.put('http://localhost:2222/users/login', body, {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  validateID(id) {
    return this.http.get(`http://localhost:2222/users/validateid/` + id)
  }
  validateEmail(email) {
    return this.http.get(`http://localhost:2222/users/validateemail/` + email)
  }
  register(body) {
    return this.http.post('http://localhost:2222/users/register', body, {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  getTokenWithRefresh(id) {
    return this.http.get('http://localhost:2222/users/gettokenwithrefresh/' + id)
  }
  getNumberOfProducts() {
    return this.http.get('http://localhost:2222/orders/productscount')
  }

  getNumberOfOrders() {
    return this.http.get('http://localhost:2222/orders/orderscount')
  }
  logOut() {
    return this.http.put('http://localhost:2222/users/logout', { body: localStorage.token }, {
      headers: { 'Content-Type': 'application/json' }
    })
  }


  ///////////SHOPPING PROCESS////////
  getAllproducts() {
    return this.http.get('http://localhost:2222/orders', {
      headers: { 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }

  getProductsByCategory(categoryID) {
    return this.http.get('http://localhost:2222/orders/bycategory/' + categoryID, {
      headers: { 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  getProdactByName(searchstring) {
    return this.http.get('http://localhost:2222/orders/byname/' + searchstring, {
      headers: { 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  getNumOfInCartItems(basketID) {
    return this.http.get('http://localhost:2222/orders/numofincartitems/' + basketID, {
      headers: { 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    }).subscribe(
      (res: any) => {
        console.log(res)
        this._data.numOfInCartItems = res.num_of_items[0]['SUM(quantity)']
      }, err => {
        console.log(err)
      }
    )
  }
  getTotalPrice(id) {
    return this.http.get('http://localhost:2222/orders/totalprice/' + id, {
      headers: { 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  searchBaskets(id) {
    return this.http.get('http://localhost:2222/orders/searchbaskets/' + id, {
      headers: { 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  postBasket(body) {
    return this.http.post('http://localhost:2222/orders/basket', JSON.stringify({ body }), {
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  postProductToBasket(productID, newBasketID, quantity) {
    return this.http.post('http://localhost:2222/orders/iteminbasket', ({ productID, newBasketID, quantity }), {
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  addQuantity(id: number, basketid: number) {
    return this.http.put('http://localhost:2222/orders/addquantity/', { id, basketid }, {
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })

  }
  removeQuantity(id: number, basketid: number) {
    return this.http.put('http://localhost:2222/orders/removequantity/', { id, basketid }, {
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  deleteProductFromBasket(id: number, basketid: number) {
    return this.http.delete('http://localhost:2222/orders/deletefrombasket/' + id + '/' + basketid, {
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  emptyBasket(basketid: number) {
    return this.http.delete('http://localhost:2222/orders/emptybasket/' + basketid, {
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })

  }
  freeShipDates() {
    return this.http.get('http://localhost:2222/orders/freeshipdates', {
      headers: { 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  saveBasket(id: any, totalPrice: any, shippingDate: string, card: number, userID: number, city: string, street: string) {

    return this.http.put('http://localhost:2222/orders/savebasket/', { id, totalPrice, shippingDate, card, userID, city, street }, {
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  lastOrder(id: string, basketid: string) {
    return this.http.get('http://localhost:2222/orders/lastorder/' + id + '/' + basketid, {
      headers: { 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }


  printReceipt(userID, basketID) {
    return this.http.get('http://localhost:2222/orders/printreceipt/' + userID + '/' + basketID, {
      responseType: 'blob',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  ///////ADMIN//////
  addproduct(body) {
    return this.http.post('http://localhost:2222/orders/post', body, {
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  selectForEditing(id) {
    return this.http.get('http://localhost:2222/orders/selectforediting/' + id, {
      headers: { 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  editProduct(id, body) {
    return this.http.put('http://localhost:2222/orders/edit/admin/' + id, body, {
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.token, 'Refresh': localStorage.refresh_token }
    })
  }
  public horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  public verticalPosition: MatSnackBarVerticalPosition = "bottom"
  openSnackBar(msg) {
    this._sb.open(msg, '', {
      duration: 1500,
      horizontalPosition: this.horizontalPosition = "center",
      verticalPosition: this.verticalPosition = "bottom"

    })
  }
  addExtraClass: boolean = true;
  openSnackBarVeryAngry(msg) {
    this._sb.open(msg, '', {
      duration: 10000,
      horizontalPosition: this.horizontalPosition = "center",
      verticalPosition: this.verticalPosition = "bottom",
      panelClass: 'custom-css-class',
    })
  }
  openSnackBarSearch(msg) {
    this._sb.open(msg, '', {
      duration: 2500,
      horizontalPosition: this.horizontalPosition = "left",
      verticalPosition: this.verticalPosition = "top",
    });
  }
}

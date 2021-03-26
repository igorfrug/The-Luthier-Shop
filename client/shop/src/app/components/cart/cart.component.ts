import { templateJitUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';
import jwt_decode from 'jwt-decode'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    private _server: ServerService,
    public _data: DataService,
    public _r: Router
  ) { }

  ngOnInit(): void {

    this._data.user = this._data.decoded[0]
    setTimeout(() => {
      this._server.searchBaskets(this._data.user.id).subscribe(
        (res: any) => {
          console.log(res)
          if (!res.open_basket) {
            this._server.postBasket(this._data.user.id).subscribe(
              (res: any) => {
                this._data.newBasket = res.newbasket[res.newbasket.length - 1]
                this._data.totalPrice = 0
                this._data.productQuantity = 0
                this._server.getNumOfInCartItems(this._data.newBasket.id)
              }, err => {
                console.log(err)
              }
            )
          } else {
            this._data.newBasket = res.open_basket
            this._data.InCartProducts = res.chosen_items
            let totalPrice = 0
            for (let icp of this._data.InCartProducts) {
              totalPrice = totalPrice += icp.total_price
              this._data.totalPrice = totalPrice
              this._data.InCartProduct = icp
            }
            this._server.getNumOfInCartItems(this._data.newBasket.id)
          }
        }, err => {
          console.log(err)
        }
      )

    }, 100);


  }


  emptyBasket(basketid) {
    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded
    if (Date.now() / 1000 < decoded.exp) {
      this._server.emptyBasket(basketid).subscribe(
        (res: any) => {
          console.log(res)
          for (let product of this._data.products) {
            product.quantity = 0
            product.total_price = 0
          }
          this._data.InCartProducts = null
          this._data.totalPrice = 0
          this._data.productQuantity = 0
          this._data.InCartIDs.splice(0, this._data.InCartIDs.length)
          this._server.openSnackBar("Your Cart is empty now")
          this._server.getNumOfInCartItems(this._data.newBasket.id)
        }, err => {
          console.log(err)
        }
      )
    } else if (Date.now() / 1000 < decoded_refresh.exp) {
      console.log(decoded_refresh)
      this._server.getTokenWithRefresh(decoded_refresh.id).subscribe(
        (res: any) => {
          localStorage.token = res.access_token
          console.log('ok refresh', localStorage.token)
          const decoded: any = jwt_decode(localStorage.token)
          this._data.decoded = decoded
          this._data.user = decoded[0]
          this._server.emptyBasket(basketid).subscribe(
            (res: any) => {
              console.log(res)
              for (let product of this._data.products) {
                product.quantity = 0
                product.total_price = 0
              }
              this._data.InCartProducts = null
              this._data.totalPrice = 0
              this._data.productQuantity = 0
              this._data.InCartIDs.splice(0, this._data.InCartIDs.length)
              this._server.openSnackBar("Your Cart is empty now")
              this._server.getNumOfInCartItems(this._data.newBasket.id)
            }, err => {
              console.log(err)
            }
          )
        }, err => {
          console.log(err)
        }
      )
    } else {
      console.log("I eraised everything guard")
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      this._data.newBasket = null
      this._data.InCartIDs.splice(0, this._data.InCartIDs.length)
      this._data.numOfInCartItems = null
      this._r.navigateByUrl('/intro/login')
    }
  }





  handleClick() {
    this._data.products = null
    this._r.navigateByUrl('order')
  }
  closeBasket() {
    this._data.hideToggle = false
  }
}

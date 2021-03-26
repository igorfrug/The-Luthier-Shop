import { Component, Input, OnInit } from '@angular/core';
import InCartProductInterface from 'src/app/interfaces/inCart';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';
import jwt_decode from 'jwt-decode'
import { Router } from '@angular/router';

@Component({
  selector: 'app-in-cart-product',
  templateUrl: './in-cart-product.component.html',
  styleUrls: ['./in-cart-product.component.css']
})
export class InCartProductComponent implements OnInit {

  @Input() public InCartProduct: InCartProductInterface

  constructor(
    public _data: DataService,
    public _server: ServerService,
    private _r: Router) {

  }

  ngOnInit(): void {
    for (let icp of this._data.InCartProducts) {
      this._data.InCartProduct = icp
    }

  }
  deleteProductFromBasket(id, basketid) {
    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded
    if (Date.now() / 1000 < decoded.exp) {
      this._server.deleteProductFromBasket(id, basketid).subscribe(
        (res: any) => {
          console.log(res.deletedItem)
          this._data.deletedProduct = this._data.products.find(p => p.id === id)
          this._data.deletedProduct.quantity = 0
          this._data.deletedProduct.total_price = 0
          const index = this._data.products.findIndex(p => p.id === id)
          this._data.products[index] = this._data.deletedProduct
          const newInCartArr = this._data.InCartProducts.filter(p => p.id != id)
          this._data.InCartProducts = newInCartArr
          this._data.InCartProduct = null
          this._data.totalPrice = res.totalPrice[0]['SUM (total_price)']
          this._server.getNumOfInCartItems(this._data.newBasket.id)
          this._data.InCartIDs = this._data.InCartIDs.filter(icID => icID !== id)
          this._server.openSnackBar('The ' + this.InCartProduct.name + ' was successfully removed from your cart.')
        }, err => {
          console.log(err)
        }
      )
    } else if (Date.now() / 1000 < decoded_refresh.exp) {
      this._server.getTokenWithRefresh(decoded_refresh.id).subscribe(
        (res: any) => {
          localStorage.token = res.access_token
          console.log('ok refresh', localStorage.token)
          const decoded: any = jwt_decode(localStorage.token)
          this._data.decoded = decoded
          this._data.user = decoded[0]
          this._server.deleteProductFromBasket(id, basketid).subscribe(
            (res: any) => {
              console.log(res.deletedItem)
              const deletedProduct = this._data.products.find(p => p.id === id)
              deletedProduct.quantity = 0
              deletedProduct.total_price = 0
              const index = this._data.products.findIndex(p => p.id === id)
              this._data.products[index] = deletedProduct
              const newInCartArr = this._data.InCartProducts.filter(p => p.id != id)
              this._data.InCartProducts = newInCartArr
              this._data.InCartIDs = this._data.InCartIDs.filter(icID => icID !== id)
              this._data.InCartProduct = null
              this._data.totalPrice = res.totalPrice[0]['SUM (total_price)']
              this._server.getNumOfInCartItems(this._data.newBasket.id)
              this._server.openSnackBar('The ' + this.InCartProduct.name + ' was successfully removed from your cart.')
            }, err => {
              console.log(err)
            }
          )
        }, err => {
          console.log(err)
        }
      )
    } else {
      this._data.user = null
      this._data.openBasket = null
      this._data.newBasket = null
      console.log("I eraised everything guard")
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      this._r.navigateByUrl('/intro/login')
    }
  }
}


import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import ProductInterface from 'src/app/interfaces/product';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';
import jwt_decode from 'jwt-decode'
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export interface DialogData {
  product: ProductInterface
}
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() public product: ProductInterface

  public panelOpenState: boolean = false

  constructor(
    public _data: DataService,
    private _server: ServerService,
    private _sb: MatSnackBar,
    private _r: Router,
    public dialog: MatDialog) {

  }
  ngOnInit(): void {
    setTimeout(() => {
      if (this._data.InCartProducts && this._data.InCartIDs.length === 0) {
        for (let icp of this._data.InCartProducts) {
          this._data.InCartIDs.push(icp.id)
        }
      }
    }, 150);

  }
  postProductToBasket(productID, basketID, quantity) {

    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded
    if (Date.now() / 1000 < decoded.exp) {
      this.product.quantity = 1
      this.product.total_price = this.product.price

      this._server.postProductToBasket(productID, basketID, quantity).subscribe(
        (res: any) => {
          console.log(res.item_in_basket[0])
          const incartItem = res.item_in_basket[0]
          console.log(incartItem)
          this._data.InCartProduct = incartItem
          incartItem.quantity = 1
          this._data.InCartProducts == undefined ? this._data.InCartProducts = [] : ''
          this._data.InCartProducts.push(incartItem)
          this._data.InCartIDs.push(incartItem.id)
          const index = this._data.products.findIndex(p => p.id === productID)
          this._data.products[index] = incartItem
          let totalPrice = 0
          for (let icp of this._data.InCartProducts) {
            totalPrice += icp.total_price
            this._data.totalPrice = totalPrice
          }
          this._server.getNumOfInCartItems(this._data.newBasket.id)
          this._server.openSnackBar(`The${this.product.name} was successfully added to yor cart.`)
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
          this._server.postProductToBasket(productID, basketID, quantity).subscribe(
            (res: any) => {
              console.log(res.item_in_basket[0])
              const incartItem = res.item_in_basket[0]
              this._data.InCartProduct = incartItem
              this._data.InCartProducts == undefined ? this._data.InCartProducts = [] : ''
              this._data.InCartProducts.push(incartItem)
              this._data.InCartIDs.push(incartItem.id)
              const index = this._data.products.findIndex(p => p.id === productID)
              this._data.products[index] = incartItem

              let totalPrice = 0
              for (let icp of this._data.InCartProducts) {
                totalPrice += icp.total_price
                this._data.totalPrice = totalPrice
              }
              this._server.getNumOfInCartItems(this._data.newBasket.id)
              this._server.openSnackBar('The' + this.product.name + ' was successfully added to yor cart.Now you can set the quantity of yor purchased item.')
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
      this._data.user = null
      this._data.openBasket = null
      this._r.navigateByUrl('/intro/login')
    }
  }


  deleteProductFromBasket(id, basketid) {
    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded

    if (Date.now() / 1000 < decoded.exp) {
      this._server.deleteProductFromBasket(id, basketid).subscribe(
        (res: any) => {
          console.log(res)
          const newInCartArr = this._data.InCartProducts.filter(icp => icp.id != id)
          this._data.InCartProducts = newInCartArr
          this._data.totalPrice = res.totalPrice[0]['SUM (total_price)']
          this._data.InCartIDs = this._data.InCartIDs.filter(icID => icID !== id)
          this._data.InCartProduct = null
          this.product.quantity = 0
          this.product.total_price = 0
          this._server.getNumOfInCartItems(this._data.newBasket.id)
          this._server.openSnackBar('The ' + this.product.name + ' was successfully removed from your cart.')
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
              console.log(res)
              const newInCartArr = this._data.InCartProducts.filter(icp => icp.id != id)
              this._data.InCartProducts = newInCartArr
              this._data.totalPrice = res.totalPrice[0]['SUM (total_price)']
              this._data.InCartIDs = this._data.InCartIDs.filter(icID => icID !== id)
              this._data.InCartProduct = null
              this.product.quantity = 0
              this.product.total_price = 0
              this._server.getNumOfInCartItems(this._data.newBasket.id)
              this._server.openSnackBar('The ' + this.product.name + ' was successfully removed from your cart.')
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
      console.log("I eraised everything guard")
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      this._r.navigateByUrl('/intro/login')
    }
  }




  addQuantity(id, basketid) {

    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded
    if (Date.now() / 1000 < decoded.exp) {
      this._server.addQuantity(id, basketid).subscribe(
        (res: any) => {
          console.log(res.updated_q[0].quantity)
          let sertainInCartProduct: any = this._data.InCartProducts.find(p => p.id === id)
          sertainInCartProduct = res.updated_q[0]
          const index = this._data.InCartProducts.findIndex(icp => icp.id === id)
          this._data.InCartProducts[index] = sertainInCartProduct
          const i = this._data.products.findIndex(p => p.id === id)
          this.product = sertainInCartProduct
          this._data.totalPrice = this._data.totalPrice + sertainInCartProduct.price
          this._server.getNumOfInCartItems(this._data.newBasket.id)
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
          this._server.addQuantity(id, basketid).subscribe(
            (res: any) => {
              console.log(res.updated_q[0].quantity)
              let sertainInCartProduct: any = this._data.InCartProducts.find(p => p.id === id)
              sertainInCartProduct = res.updated_q[0]
              const index = this._data.InCartProducts.findIndex(icp => icp.id === id)
              this._data.InCartProducts[index] = sertainInCartProduct
              const i = this._data.products.findIndex(p => p.id === id)
              this.product = sertainInCartProduct
              if (this._data.deletedProduct && this._data.deletedProduct.id === this.product.id) { this.product.quantity = 0 }
              this._data.totalPrice = this._data.totalPrice + sertainInCartProduct.price
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
      this._data.user = null
      this._data.openBasket = null
      this._data.newBasket = null
      this._r.navigateByUrl('/intro/login')
    }
  }
  removeQuantity(id, basketid) {

    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded
    if (Date.now() / 1000 < decoded.exp) {
      this._server.removeQuantity(id, basketid).subscribe(
        (res: any) => {
          console.log(res.updated_q[0].quantity)
          let sertainInCartProduct: any = this._data.InCartProducts.find(p => p.id === id)
          sertainInCartProduct = res.updated_q[0]
          const index = this._data.InCartProducts.findIndex(icp => icp.id === id)
          this._data.InCartProducts[index] = sertainInCartProduct
          console.log(this._data.InCartProducts)
          this.product = res.updated_q[0]
          this._data.totalPrice = this._data.totalPrice - sertainInCartProduct.price
          if (this.product.quantity < 1) {
            this.deleteProductFromBasket(id, basketid)
          }
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
          this._server.removeQuantity(id, basketid).subscribe(
            (res: any) => {
              console.log(res.updated_q[0].quantity)
              let sertainInCartProduct: any = this._data.InCartProducts.find(p => p.id === id)
              sertainInCartProduct = res.updated_q[0]
              const index = this._data.InCartProducts.findIndex(icp => icp.id === id)
              this._data.InCartProducts[index] = sertainInCartProduct
              this.product = res.updated_q[0]
              const i = this._data.products.findIndex(p => p.id === id)
              this.product = sertainInCartProduct
              this._data.totalPrice = this._data.totalPrice - sertainInCartProduct.price
              if (this.product.quantity < 1) {
                this.deleteProductFromBasket(id, basketid)
              }
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
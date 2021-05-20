
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';
import jwt_decode from 'jwt-decode'

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  public panelOpenState = false

  constructor(
    private _server: ServerService,
    public _data: DataService,
    private _r: Router) { }

  ngOnInit(): void {
    this.getAllProducts()


  }

  getAllProducts() {
    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded
    if (Date.now() / 1000 < decoded.exp) {
      this._server.getAllproducts().subscribe(
        (res: any) => {
          this._data.products = res.selectedProducts
          console.log(this._data.products)
          setTimeout(() => {
            if (this._data.InCartProducts) {
              for (let icp of this._data.InCartProducts) {
                for (let product of this._data.products) {
                  if (icp.id === product.id) {
                    product.total_price = icp.total_price
                    product.quantity = icp.quantity
                  }
                }
              }
            }
          }, 100);
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
          this._server.getAllproducts().subscribe(
            (res: any) => {
              this._data.products = res.selectedProducts
              console.log(this._data.products)
              setTimeout(() => {
                if (this._data.InCartProducts) {
                  for (let icp of this._data.InCartProducts) {
                    for (let product of this._data.products) {
                      if (icp.id === product.id) {
                        product.total_price = icp.total_price
                        product.quantity = icp.quantity
                      }
                    }
                  }
                }
              }, 100);

            }, err => {
              console.log(err)
            }
          )
        }, err => {
          console.log(err)
        })
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

  getProductsByCategory(categoryID) {
    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded
    if (Date.now() / 1000 < decoded.exp) {
      this._server.getProductsByCategory(categoryID).subscribe(
        (res: any) => {
          this._data.products = res.products_by_category
          console.log(this._data.products)
          this._r.navigateByUrl('/clientmain/display/displaybycategory')
          setTimeout(() => {
            if (this._data.InCartProducts) {
              for (let icp of this._data.InCartProducts) {
                for (let product of this._data.products) {
                  if (icp.id === product.id) {
                    product.total_price = icp.total_price
                    product.quantity = icp.quantity
                  }
                }
              }
            }
          }, 100);
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
          this._server.getProductsByCategory(categoryID).subscribe(
            (res: any) => {
              this._data.products = res.products_by_category
              this._r.navigateByUrl('/clientmain/display/displaybycategory')
              setTimeout(() => {
                if (this._data.InCartProducts) {
                  for (let icp of this._data.InCartProducts) {
                    for (let product of this._data.products) {
                      if (icp.id === product.id) {
                        product.total_price = icp.total_price
                        product.quantity = icp.quantity
                      }
                    }
                  }
                }
              }, 100);
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
      this._data.openBasket = null
      this._data.newBasket = null
      this._data.InCartIDs.splice(0, this._data.InCartIDs.length)
      this._data.numOfInCartItems = null
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      this._r.navigateByUrl('/intro/login')
    }
  }
}


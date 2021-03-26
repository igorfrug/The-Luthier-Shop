import { Component, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';
import jwt_decode from 'jwt-decode'
import { HostListener } from "@angular/core";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  scrWidth: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize() {

    this.scrWidth = window.innerWidth;
    this._data.scrSize = window.innerWidth
  }
  constructor(
    public _data: DataService,
    private _server: ServerService,
    private _r: Router
  ) { this.getScreenSize(); }
  @Output() public search: string
  public numOfItems: any
  ngOnInit(): void {
    if (localStorage.token && localStorage.refresh_token) {
      const decoded: any = jwt_decode(localStorage.token)
      const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
      this._data.decoded = decoded
      if (Date.now() / 1000 < decoded.exp) {
        if (!this._data.user) {
          this._data.user = decoded[0]
        }
        this._server.searchBaskets(this._data.user.id).subscribe(
          (res: any) => {
            this._data.openBasket = res.open_basket
            this._data.LastClosedBasket = res.closed_selectedBasket
            if (this._data.user.role === 'client') {
              if (res.open_basket) {
                this._data.openBasket = res.open_basket
              } else {
                this._data.openBasket = res.closed_selectedBasket
              }
              this._data.InCartProducts = res.chosen_items
              if (this._data.openBasket) { this._server.getNumOfInCartItems(this._data.openBasket.id) }
            }
          }, err => {
            console.log(err)
          }
        )
      } else if (Date.now() / 1000 > decoded.exp && Date.now() / 1000 < decoded_refresh.exp) {
        this._server.getTokenWithRefresh(decoded_refresh.id).subscribe(
          (res: any) => {
            console.log('ok refresh', res.access_token)
            const decoded: any = jwt_decode(res.access_token)
            this._data.decoded = decoded
            console.log(this._data.decoded)
            if (!this._data.user) {
              this._data.user = decoded[0]
            }
            localStorage.token = res.access_token
            this._server.searchBaskets(this._data.user.id).subscribe(
              (res: any) => {
                this._data.openBasket = res.open_basket
                this._data.LastClosedBasket = res.closed_selectedBasket
                if (this._data.user.role === 'client') {
                  if (res.open_basket) {
                    this._data.openBasket = res.open_basket
                  } else {
                    this._data.openBasket = res.closed_selectedBasket
                  }
                  this._data.InCartProducts = res.chosen_items
                  if (this._data.openBasket) { this._server.getNumOfInCartItems(this._data.openBasket.id) }
                }
              }, err => {
                console.log(err)
              }
            )
          }, err => {
            console.log(err)
          }
        )
      } else if (Date.now() / 1000 > decoded.exp && Date.now() / 1000 > decoded_refresh.exp) {
        console.log("I eraised everything guard")
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        this._data.user = null
        this._data.openBasket = null
        this._data.newBasket = null
        this._data.InCartIDs.splice(0, this._data.InCartIDs.length)
        this._data.numOfInCartItems = null
        this._r.navigateByUrl('/intro/login')
      }
    } else {
      this._r.navigateByUrl('/intro/login')
    }
  }


  @ViewChild('input', { static: false })
  private input: ElementRef;


  getProductByName(searchstring: string) {
    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded
    if (Date.now() / 1000 < decoded.exp) {
      if (!this._data.user) {
        this._data.user = decoded[0]
        console.log(this._data.user)
      }
      console.log("ok")
      this._server.getProdactByName(searchstring).subscribe(
        (res: any) => {
          console.log(res)
          if (res.product_by_name.length === 0) {
            this._server.openSnackBarSearch('Sorry,no match for your search')
            this.input.nativeElement.value = "";
            this.search
          } else {
            this._data.products = res.product_by_name
            this.input.nativeElement.value = "";
          }
        }, err => {
          console.log(err)
        }
      )
    } else if (Date.now() / 1000 > decoded.exp && Date.now() / 1000 < decoded_refresh.exp) {
      this._server.getTokenWithRefresh(decoded_refresh.id).subscribe(
        (res: any) => {
          console.log('ok refresh', res.access_token)
          const decoded: any = jwt_decode(res.access_token)
          this._data.decoded = decoded
          if (!this._data.user) {
            this._data.user = decoded[0]
          }
          localStorage.token = res.access_token
          this._server.getProdactByName(searchstring).subscribe(
            (res: any) => {
              console.log(res)
              if (res.product_by_name.length === 0) {
                this._server.openSnackBarSearch('Sorry,no match for your search')
                this.input.nativeElement.value = "";
              } else {
                this._data.products = res.product_by_name
                this.input.nativeElement.value = "";
              }
            }, err => {
              console.log(err)
            }
          )
        }
      )
    }
  }


  logOut() {
    this._server.logOut().subscribe(
      (res: any) => {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        this._data.user = null
        if (this._data.products) {
          this._data.products = null
        }
        this._data.openBasket = null
        this._data.newBasket = null
        this._data.InCartProducts = null
        this._data.totalPrice = null
        this._data.InCartIDs.splice(0, this._data.InCartIDs.length)
        this._data.numOfInCartItems = null
        this._r.navigateByUrl('/intro/login')
      }, err => {
        console.log(err)
      })
  }
}

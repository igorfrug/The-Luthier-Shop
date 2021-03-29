import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode'
import { DataService } from '../services/data.service';
import { ServerService } from '../services/server.service';

@Injectable({
  providedIn: 'root'
})
export class ThankyouGuard implements CanActivate {
  constructor(
    private _data: DataService,
    private _r: Router,
    private _server: ServerService
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.token && localStorage.refresh_token) {
      const decoded: any = jwt_decode(localStorage.token)
      const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
      this._data.decoded = decoded
      if (Date.now() / 1000 < decoded.exp) {
        if (!this._data.user) {
          this._data.user = decoded[0]
        }
        if (this._data.user && this._data.user.role === 'client') {
          console.log("ok")
          this._server.searchBaskets(this._data.user.id).subscribe(
            (res: any) => {
              console.log(res.open_basket)
              console.log(res.closed_selectedBasket)
              console.log(res.chosen_items)
              if (res.open_basket) {
                this._data.openBasket = res.open_basket
              } else {
                this._data.openBasket = res.closed_selectedBasket
              }
              this._data.LastClosedBasket = res.closed_selectedBasket
              this._data.InCartProducts = res.chosen_items
            }, err => {
              console.log(err)
            }
          )
          return true;
        } else if (this._data.user.role === 'admin') {
          this._data.user.signedIn = true
          this._r.navigateByUrl('/adminmain/admindisplay')
        }
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

            this._server.searchBaskets(this._data.user.id).subscribe(
              (res: any) => {
                console.log(res.open_basket)
                console.log(res.closed_selectedBasket)
                console.log(res.chosen_items)
                if (res.open_basket) {
                  this._data.openBasket = res.open_basket
                } else {
                  this._data.openBasket = res.closed_selectedBasket
                }
                this._data.LastClosedBasket = res.closed_selectedBasket
                if (res.open_basket) {
                  this._data.openBasket = res.open_basket
                } else {
                  this._data.openBasket = res.closed_selectedBasket
                }
                this._data.InCartProducts = res.chosen_items

              }, err => {
                console.log(err)
              }
            )

          }, err => {
            console.log(err)
          }
        )
        return true

      } else if (Date.now() / 1000 > decoded.exp && Date.now() / 1000 > decoded_refresh.exp) {
        console.log("I eraised everything guard")
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        this._data.user = null
        this._data.openBasket = null
        this._r.navigateByUrl('/intro/login')
      }
    } else {
      this._r.navigateByUrl('/intro/login')
      return false
    }
  }
}



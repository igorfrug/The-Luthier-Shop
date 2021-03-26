import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';
import jwt_decode from 'jwt-decode'
import { ServerService } from '../services/server.service';
@Injectable({
  providedIn: 'root'
})
export class SignedInGuard implements CanActivate {
  constructor(
    private _data: DataService,
    private _r: Router,
    private _server: ServerService) { }

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
          if (this._data.InCartProducts) {
            for (let icp of this._data.InCartProducts) {
              this._data.InCartIDs.push(icp.id)
            }
          }
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
            if (this._data.InCartProducts) {
              for (let icp of this._data.InCartProducts) {
                this._data.InCartIDs.push(icp.id)
              }
            }
          }, err => {
            console.log(err)
          }
        )
        return true

      } else if (Date.now() / 1000 > decoded.exp && Date.now() / 1000 > decoded_refresh.exp) {
        console.log("I eraised everything guard")
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        this._data.openBasket ? this._data.openBasket = null : ''
        this._data.user = null
        this._r.navigateByUrl('/intro/login')
      }
    } else {
      this._r.navigateByUrl('/intro/login')
      return false
    }
  }
}





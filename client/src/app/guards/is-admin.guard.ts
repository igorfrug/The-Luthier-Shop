import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';
import jwt_decode from 'jwt-decode'
import { ServerService } from '../services/server.service';
@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {
  constructor(
    private _data: DataService,
    private _server: ServerService,
    private _r: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.token && localStorage.refresh_token) {
      const decoded: any = jwt_decode(localStorage.token)
      const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
      if (Date.now() / 1000 < decoded.exp) {
        if (!this._data.user) {
          this._data.user = decoded[0]
        }
        if (this._data.user && this._data.user.role === 'admin') {
          console.log("ok admin")
          return true;
        } else if (this._data.user.role === 'client') {
          this._server.openSnackBarVeryAngry("You tried to rich a restricted area,Maestro! I could leave you where you were but you will start from the beginning,Maestro! Please, don't try me again,Maestrissimo!")
          this._r.navigateByUrl('/intro/login')
        }
      } else if (Date.now() / 1000 > decoded.exp && Date.now() / 1000 < decoded_refresh.exp) {
        this._server.getTokenWithRefresh(decoded_refresh.id).subscribe(
          (res: any) => {
            const decoded: any = jwt_decode(res.access_token)
            if (!this._data.user) {
              this._data.user = decoded[0]
            }
            localStorage.token = res.access_token
            console.log('ok refresh admin', localStorage.token)
            if (this._data.user && this._data.user.role === 'admin') {
              console.log("ok admin refresh")
              return true;
            } else if (this._data.user.role === 'client') {
              this._server.openSnackBarVeryAngry("You tried to rich a restricted area,Maestro! I could leave you where you were but you will start from the beginning,Maestro! Please, don't try me again,Maestrissimo!")
              this._r.navigateByUrl('/intro/login')
            }

          }, err => {
            console.log(err)
          }
        )
        return true
      } else if (Date.now() / 1000 > decoded.exp && Date.now() / 1000 > decoded_refresh.exp) {
        this._data.user = null
        console.log("I eraised everything guard")
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        this._r.navigateByUrl('/intro/login')
      }
    } else {
      this._r.navigateByUrl('/intro/login')
    }
  }
}
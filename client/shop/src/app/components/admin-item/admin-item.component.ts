import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import ProductInterface from 'src/app/interfaces/product';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';
import jwt_decode from 'jwt-decode'
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-item',
  templateUrl: './admin-item.component.html',
  styleUrls: ['./admin-item.component.css']
})
export class AdminItemComponent implements OnInit {

  @Input() public product: ProductInterface
  panelOpenState = false;
  constructor(
    public _data: DataService,
    private _server: ServerService,
    private _sb: MatSnackBar,
    private _r: Router) { }

  ngOnInit(): void {
  }

  selectForEditing(id) {
    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded
    console.log(Date.now() / 1000 < decoded.exp)
    if (Date.now() / 1000 < decoded.exp) {
      this._server.selectForEditing(id).subscribe(
        (res: any) => {
          console.log(res.selected_product)
          this._data.productForEditing = res.selected_product[0]
          console.log(this._data.productForEditing)
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
          this._server.selectForEditing(id).subscribe(
            (res: any) => {
              console.log(res.selected_product)
              this._data.productForEditing = res.selected_product[0]
              console.log(this._data.productForEditing)
            }, err => {
              console.log(err)
            }
          )
        }
      )
    } else {
      console.log("I eraised everything guard")
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      this._r.navigateByUrl('/intro/login')
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';
import jwt_decode from 'jwt-decode'
@Component({
  selector: 'app-itemforediting',
  templateUrl: './itemforediting.component.html',
  styleUrls: ['./itemforediting.component.css']
})
export class ItemforeditingComponent implements OnInit {

  public myForm: FormGroup
  constructor(
    public _data: DataService,
    private _server: ServerService,
    private _r: Router,
    private _sb: MatSnackBar,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.myForm = this._fb.group({
      name: this._data.productForEditing.name,
      author: this._data.productForEditing.author,
      price: this._data.productForEditing.price,
      image: this._data.productForEditing.image,
      description: this._data.productForEditing.description
    })
    console.log(this._data.productForEditing.name)
  }
  editProduct(id) {
    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded
    if (Date.now() / 1000 < decoded.exp) {
      this._server.editProduct(id, this.myForm.value).subscribe(
        (res: any) => {
          console.log(res.updatedProduct)
          const updatedProduct = res.updatedProduct[0]
          const index = this._data.products.findIndex(p => p.id === this._data.productForEditing.id)
          this._data.products[index] = updatedProduct
          this._data.productForEditing = null
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
          this._server.editProduct(id, this.myForm.value).subscribe(
            (res: any) => {
              console.log(res.updatedProduct)
              const updatedProduct = res.updatedProduct[0]
              const index = this._data.products.findIndex(p => p.id === this._data.productForEditing.id)
              this._data.products[index] = updatedProduct
              this._data.productForEditing = null
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
      this._r.navigateByUrl('/intro/login')
    }
  }
}

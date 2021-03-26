import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';
import jwt_decode from 'jwt-decode'
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public myForm: FormGroup

  constructor(
    public _data: DataService,
    private _server: ServerService,
    private _fb: FormBuilder,
    public _r: Router) {

  }

  ngOnInit() {
    this.myForm = this._fb.group({
      name: ['', Validators.required],
      author: ['', Validators.required],
      categoryID: ['', Validators.required],
      price: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    })
  }
  addProduct() {
    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded
    if (Date.now() / 1000 < decoded.exp) {
      this._server.addproduct(this.myForm.value).subscribe(
        (res: any) => {
          console.log(res.new_product)
          const newProduct = res.new_product
          this._data.products.push(newProduct)
          this.myForm.reset()
          this._r.navigateByUrl('/adminmain/admindisplay')
          this._server.openSnackBar("The item was successfully added.")
        }, err => {
          console.log(err)
        }
      )
    } else if (Date.now() / 1000 < decoded_refresh.exp) {
      const decoded: any = jwt_decode(localStorage.token)
      this._server.getTokenWithRefresh(decoded_refresh.id).subscribe(
        (res: any) => {
          localStorage.token = res.access_token
          console.log('ok refresh', localStorage.token)
          const decoded: any = jwt_decode(localStorage.token)
          this._data.decoded = decoded
          this._data.user = decoded[0]
          this._server.addproduct(this.myForm.value).subscribe(
            (res: any) => {
              console.log(res.new_product)
              const newProduct = res.new_product
              this._data.products.push(newProduct)
              this.myForm.reset()
              this._r.navigateByUrl('/adminmain/admindisplay')
              this._server.openSnackBar("The item was successfully added.")
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

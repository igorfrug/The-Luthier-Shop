import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';
import jwt_decode from 'jwt-decode'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public myForm: FormGroup
  public hide = true;
  constructor(
    public _r: Router,
    public _fb: FormBuilder,
    public _server: ServerService,
    public _data: DataService) { }

  ngOnInit(): void {
    if (!localStorage.token && !localStorage.refresh_token) {
      this.myForm = this._fb.group({
        email: ['', Validators.email],
        password: ['', Validators.required]
      })
    } else {
      console.log('relogin')
      const decoded: any = jwt_decode(localStorage.token)
      const refresh_decoded: any = jwt_decode(localStorage.refresh_token)
      if (decoded.exp > Date.now() / 1000) {
        console.log('relogin ok token')
        this._data.decoded = decoded
        this._data.user = decoded[0]
        if (this._data.user.role === 'client') {
          this._r.navigateByUrl('/intro/welcome')
          console.log('got here from login token')
        } else {
          console.log(this._data.user)
          this._data.user.signedIn = true
          this._r.navigateByUrl('/adminmain/admindisplay')
          console.log('got here from login token admin')
        }
      } else if (refresh_decoded.exp > Date.now() / 1000) {
        console.log('relogin refresh token')
        this._server.getTokenWithRefresh(refresh_decoded.id).subscribe(
          (res: any) => {
            localStorage.token = res.access_token
            console.log('relogin ok refresh token')
            const decoded: any = jwt_decode(localStorage.token)
            this._data.decoded = decoded
            this._data.user = decoded[0]
            this._r.navigateByUrl('/intro/welcome')
            console.log('got here from login refresh token')
          }, err => {
            console.log(err)
          }
        )
      } else {
        console.log("I eraised everything log in")
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        this.myForm = this._fb.group({
          email: ['', Validators.email],
          password: ['', Validators.required]
        })
      }
    }
  }

  handleSubmit() {
    this._server.logIn(this.myForm.value).subscribe(
      (res: any) => {
        localStorage.token = res.access_token
        localStorage.refresh_token = res.refresh_token
        this._data.user = res.signedInUser[0]
        console.log(this._data.user)
        const decoded: any = jwt_decode(localStorage.token)
        this._data.decoded = decoded
        console.log(decoded[0])
        if (Date.now() / 1000 < decoded.exp) {
          this._data.user = decoded[0]
          this._data.user.signedIn = true
          console.log(decoded)
          console.log(this._data.user)
        }
        if (this._data.user.role == "admin") {
          this._r.navigateByUrl('/adminmain/admindisplay')
        } else {
          this._r.navigateByUrl('intro/welcome')
        }
      }, err => {
        console.log(err)
        this._server.openSnackBar('Wrong email-password combination.Please try again.')
      }
    )
  }

  handleClick() {
    this._r.navigateByUrl("/intro/register1")
  }
}

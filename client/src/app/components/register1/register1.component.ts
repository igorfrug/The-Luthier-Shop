import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmedValidator } from 'src/app/confirm.validator';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-register1',
  templateUrl: './register1.component.html',
  styleUrls: ['./register1.component.css']
})
export class Register1Component implements OnInit {
  public myForm1: FormGroup
  constructor(
    private _fb: FormBuilder,
    private _server: ServerService,
    public _data: DataService,
    private _r: Router,
  ) { }



  public hide = true;


  ngOnInit(): void {

    this.myForm1 = this._fb.group({
      id: ['', Validators.required],
      email: ['', Validators.email],
      password1: ['', Validators.required],
      password2: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('password1', 'password2')
    })
  }
  get f() {
    return this.myForm1.controls;
  }
  handleClick() {
    if (!this.myForm1.controls.id.value || !this.myForm1.controls.email.value || !this.myForm1.controls.password1.value
      || !this.myForm1.controls.password2.value) {
      this._server.openSnackBar("All fields are required")
    } else if (this.myForm1.controls.id.invalid) {
      this._server.openSnackBar("ID invalid")
    } else if (this.myForm1.controls.email.invalid) {
      this._server.openSnackBar("email invalid")
    } else if (this.myForm1.controls.password2.invalid) {
      this._server.openSnackBar("Password confirmation failed")
    } else {
      this._server.validateID(this.myForm1.controls.id.value).subscribe(
        (res: any) => {
          if (res.msg === "ID ok!") {
            this._server.validateEmail(this.myForm1.controls.email.value).subscribe(
              (res: any) => {
                if (res.msg === "Email ok!") {
                  this._data.userID = this.myForm1.controls.id.value
                  this._data.userEmail = this.myForm1.controls.email.value
                  this._data.userPassword = this.myForm1.controls.password1.value
                  this._r.navigateByUrl('/intro/register2')

                } else {
                  console.log(res.msg)
                  this._server.openSnackBar(res.msg)
                }
              }
            )
          } else {
            console.log(res.msg)
            this._server.openSnackBar(res.msg)
          }
        }, err => {
          console.log(err)
          this._server.openSnackBar('Sorry,the programmer is junior :)')
        }
      )
    }
  }
}



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.component.html',
  styleUrls: ['./register2.component.css']
})
export class Register2Component implements OnInit {

  public myForm2: FormGroup
  constructor(
    private _fb: FormBuilder,
    private _server: ServerService,
    private _data: DataService,
    private _r: Router) { }

  ngOnInit(): void {
    this.myForm2 = this._fb.group({
      id: this._data.userID,
      email: this._data.userEmail,
      password: this._data.userPassword,
      city: ['', Validators.required],
      street: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required]
    })
  }

  handleSubmit() {
    this._server.register(this.myForm2.value).subscribe(
      (res: any) => {
        console.log(res)
        this._data.users = res
        this._r.navigateByUrl('intro/login')
      }, err => {
        console.log(err)
        this._server.openSnackBar(err.error);
      }
    )
  }
}

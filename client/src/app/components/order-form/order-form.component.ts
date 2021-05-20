import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';
import jwt_decode from 'jwt-decode'
@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  public myForm: FormGroup
  public minDate: Date
  public maxDate: Date
  public shippingDate: string
  public city: string
  public street: string
  public card: number
  public freeShipDates: any
  public spArr: any
  public orderDate: string
  private nodate: any
  constructor(
    private _fb: FormBuilder,
    private _server: ServerService,
    public _data: DataService,
    public _r: Router
  ) {

    const currentYear = new Date().getFullYear();
    this.minDate = new Date()
    this.maxDate = new Date(currentYear, 60)
    console.log(this.minDate)
    console.log(this.maxDate)
  }

  myFilter = (d: any = moment(new Date())): boolean => {
    const availableDates: Date[] = this.spArr
    if (availableDates) {
      console.log(availableDates[3])
      let formattedAvailableDates = []
      for (let aDate of availableDates) {
        let newADate = new Date(aDate)
        console.log(newADate)
        formattedAvailableDates.push(newADate)
      }
      return formattedAvailableDates.findIndex(aDate => d._d.toDateString() == aDate.toDateString()) < 0;
    }
  }

  public creditCardValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (parseInt(control.value) !== undefined && (isNaN(control.value) || parseInt(control.value) < min || parseInt(control.value) > max)) {
        return { 'card': true };
      }
      return null;
    };

  }

  min = 1000
  max = 9999

  ngOnInit(): void {
    this.myForm = this._fb.group({
      city: ['', Validators.required],
      street: ['', Validators.required],
      date: [Date, Validators.required],
      card: ['', [Validators.required, this.creditCardValidator(this.min, this.max)]]
    })

    this._server.freeShipDates().subscribe(

      (res: any) => {
        console.log(res)
        const notAvailable = res.freeshipdates
        this.freeShipDates = notAvailable
        const nodate = this.freeShipDates.filter(d => d['COUNT (id)'] >= 3)
        this.nodate = nodate
        const spArr: Date[] = []
        for (let nd of nodate) {
          const sp: Date = nd.shipping_date
          spArr.push(sp)
          this.spArr = spArr
        }
        this.spArr = spArr
      }, err => {
        console.log(err)
      }
    )
  }

  dbclickhandler(event) {
    console.log(event)
    this.myForm = this._fb.group({
      city: [this._data.user.city, Validators.required],
      street: [this._data.user.street, Validators.required],
      date: [Date, Validators.required],
      card: ['', [Validators.required, this.creditCardValidator(this.min, this.max)]]
    })
  }


  saveBasket(id, totalPrice) {
    const decoded: any = jwt_decode(localStorage.token)
    const decoded_refresh: any = jwt_decode(localStorage.refresh_token)
    this._data.decoded = decoded
    if (Date.now() / 1000 < decoded.exp) {
      this.city = this.myForm.controls.city.value
      this.street = this.myForm.controls.street.value
      this.shippingDate = this.myForm.controls.date.value
      this.card = this.myForm.controls.card.value
      this._server.saveBasket(id, totalPrice, this.shippingDate, this.card, this._data.user.id, this.city, this.street).subscribe(
        (res: any) => {
          console.log(res.updated_basket, res.ordered_items)
          this._data.orderDetails = res.newOrder[0]
          this._data.receiptItems = this._data.InCartProducts
          this._data.InCartProducts = null
          this._r.navigateByUrl('thankyou')
          this._data.InCartIDs.splice(0, this._data.InCartIDs.length)
          this._server.openSnackBar("Your order was successfully submitted")
          this.myForm.reset();
        }, err => {
          console.log(err)
        }
      )
    } else if (Date.now() / 1000 > decoded.exp && Date.now() / 1000 < decoded_refresh.exp) {
      this._server.getTokenWithRefresh(decoded_refresh.id).subscribe(
        (res: any) => {
          localStorage.token = res.access_token
          console.log('ok refresh', localStorage.token)
          const decoded: any = jwt_decode(localStorage.token)
          this._data.decoded = decoded
          this._data.user = decoded[0]
          this.city = this.myForm.controls.city.value
          this.street = this.myForm.controls.street.value
          this.shippingDate = this.myForm.controls.date.value
          this.card = this.myForm.controls.card.value
          this._server.saveBasket(id, totalPrice, this.shippingDate, this.card, this._data.user.id, this.city, this.street).subscribe(
            (res: any) => {
              this._data.orderDetails = res.newOrder[0]
              this._data.receiptItems = this._data.InCartProducts
              this._data.InCartProducts = null
              this._data.InCartIDs.splice(0, this._data.InCartIDs.length)
              this._r.navigateByUrl('thankyou')
              this._server.openSnackBar("Your order was successfully submitted")
              this.myForm.reset();
            }, err => {
              console.log(err)
            }
          )
        }, err => {
          console.log(err)
        })
    } else {
      console.log("I eraised everything guard")
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      this._data.user = null
      this._data.openBasket = null
      this._data.newBasket = null
      this._data.orderDetails = null
      this._r.navigateByUrl('/intro/login')
    }
  }
}


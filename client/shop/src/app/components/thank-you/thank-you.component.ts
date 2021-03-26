import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';

declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit {

  constructor(
    public _data: DataService,
    private _server: ServerService,
    private _r: Router) { }
  disableBack() { window.history.forward() }
  ngOnInit(): void {
    this.disableBack();
    window.onpageshow = function (evt) { if (evt.persisted) this.disableBack() }
    this._data.user = this._data.decoded[0]
  }
  downloadReceipt(userID, basketID) {
    this._server.printReceipt(userID, basketID).subscribe(
      (res: any) => {
        console.log(res)
        const pdfName = 'receipt.pdf';
        FileSaver.saveAs(new Blob([res], { type: 'text/csv' }), pdfName);
      }, err => {
        console.log(err)
      }
    )
  }
  handleClick() {
    this._data.user = null
    this._data.LastClosedBasket = null
    this._data.newBasket = null
    this._data.openBasket = null
    this._data.numOfInCartItems = null
    this._r.navigateByUrl('/intro/welcome')
  }
}

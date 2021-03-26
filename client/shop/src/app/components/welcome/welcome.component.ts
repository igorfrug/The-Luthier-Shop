import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(
    public _data: DataService,
    private _server: ServerService,
    private _r: Router) { }

  ngOnInit(): void {
    this._data.user = this._data.decoded[0]
    this._server.searchBaskets(this._data.user.id).subscribe(
      (res: any) => {
        console.log(res.open_basket)
        console.log(res.closed_selectedBasket)
        this._data.openBasket = res.open_basket
        this._data.LastClosedBasket = res.closed_selectedBasket
      }, err => {
        console.log(err)
      }
    )

  }
  handleClick() {
    this._r.navigateByUrl('/clientmain/display')
  }
}

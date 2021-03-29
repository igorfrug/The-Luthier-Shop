import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import BasketInterface from 'src/app/interfaces/basket';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  public LastClosedBasket: BasketInterface
  constructor(
    public _server: ServerService,
    public _data: DataService) { }

  ngOnInit(): void {

    this._server.getNumberOfProducts().subscribe(
      (res: any) => {
        console.log(res.numOfProducts)
        console.log(res.numOfProducts['COUNT (id)'])
        this._data.numOfProducts = res.numOfProducts['COUNT (id)']

      }, err => {
        console.log(err)
      }
    )
    this._server.getNumberOfOrders().subscribe(
      (res: any) => {
        console.log(res.numOfOrders)
        console.log(res.numOfOrders['COUNT (id)'])
        this._data.numOfOrders = res.numOfOrders['COUNT (id)']
      }, err => {
        console.log(err)
      }
    )
  }
}

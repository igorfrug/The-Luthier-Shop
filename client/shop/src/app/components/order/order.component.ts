import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor() { }
  disableBack() { window.history.forward() }


  ngOnInit(): void {
    this.disableBack();
    window.onpageshow = function (evt) { if (evt.persisted) this.disableBack() }
  }

}

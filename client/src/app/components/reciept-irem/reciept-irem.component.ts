import { Component, OnInit, Input, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { HighlightPipe } from 'src/app/highlight.pipe'

@Component({
  selector: 'app-reciept-irem',
  templateUrl: './reciept-irem.component.html',
  styleUrls: ['./reciept-irem.component.css'],

})
export class RecieptIremComponent implements OnInit {
  public searchTerm: any
  @Input() public InCartProduct: any
  constructor(public _data: DataService) { }

  public list: any
  ngOnInit(): void {
    this.list = [
      { name: this._data.InCartProducts },
    ];
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionsOutlined } from '@material-ui/icons';
import { DataService } from 'src/app/services/data.service';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-admin-display',
  templateUrl: './admin-display.component.html',
  styleUrls: ['./admin-display.component.css']
})
export class AdminDisplayComponent implements OnInit {

  constructor(
    private _server: ServerService,
    public _data: DataService,
    private _r: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getAllProducts()
    }, 100);

  }
  getAllProducts() {
    console.log("admin display onInit")
    this._server.getAllproducts().subscribe(
      (res: any) => {
        this._data.products = res.selectedProducts
      }, err => {
        console.log(err)
      }
    )
  }

  getProductsByCategory(categoryID) {
    this._server.getProductsByCategory(categoryID).subscribe(
      (res: any) => {
        this._data.products = res.products_by_category
        this._r.navigateByUrl('/adminmain/admindisplay')
      }, err => {
        console.log(err)
      }
    )
  }

}

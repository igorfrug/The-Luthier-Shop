import { Injectable } from '@angular/core';
import BasketInterface from '../interfaces/basket';
import ProductInterface from '../interfaces/product';
import UserInterface from '../interfaces/user';
import InCartProductInterface from '../interfaces/inCart';
import jwt_decode from 'jwt-decode'
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public user: UserInterface



  public users: any
  public userID: any
  public userEmail: any
  public userPassword: any
  public numOfProducts: number
  public numOfOrders: number = 0
  public openBasket: BasketInterface
  public LastClosedBasket: BasketInterface
  public products: ProductInterface[] = []
  public product: ProductInterface
  public productQuantity: number
  public openOrder: boolean
  public totalPrice: number
  public searchResults: [] = []
  public newBasket: BasketInterface
  public InCartProduct: InCartProductInterface
  public InCartProducts: InCartProductInterface[] = []
  public productForEditing: ProductInterface
  public itemsInBasket: number
  public decoded: any
  public orderDetails: any
  public receiptItems: any
  public LastOrderItems: any
  public numOfInCartItems: number
  public deletedProduct: any
  public InCartIDs: number[] = []
  public scrSize: number
  public hideToggle: boolean
  constructor() { }





}




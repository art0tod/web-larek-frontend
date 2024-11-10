import { Model } from "./base/Model";
import { IApp, IOrder, IProduct, IAppState, ICatalogModel, IBasketView, IBasketModel, IOrderModel, IModalView, IProductList, IContactForm, IOrderForm, PaymentMethod, FormErrors, Price } from "../types";
import Product from "./Product";
import { Card } from "./Card";

export type CatalogChangeEvent = {
  catalog: IProduct[];
}

export default class AppState extends Model<IAppState> {
  catalog: IProduct[];
  basket: IProduct[] = [];
  order: IOrder = {
    payment: PaymentMethod.card,
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };
  preview: string | null;
  modal: IModalView | null;
  formErrors: FormErrors = {};
  currentCard: Card | null = null;
  total: Price;

  refreshBasket() {
    this.order.total = this.basket.reduce((total, item) => total + item.price, 0);

    this.emitChanges('counter:changed', this.basket);
    this.emitChanges('basket:changed', this.basket);
  }

  clearBasket() {
    this.basket = [];
    this.basket
    this.updateBasket();
  }

  clearOrder() {
    this.order = {
      payment: PaymentMethod.card,
      address: '',
      email: '',
      phone: '',
      total: 0,
      items: []
    }
  }

  updateBasket() {
    this.order.total = this.basket.reduce((total, item) => total + item.price, 0);

    this.emitChanges('total:changed', this.basket);
    this.emitChanges('basket:changed', this.basket);
  }

  setCatalog(products: IProduct[]) {
    this.catalog = products.map(product => new Product(product, this.events))
    this.emitChanges('products:changed', { catalog: this.catalog })
  }

  setPreview(product: IProduct) {
    this.preview = product.id;
    this.emitChanges('preview:changed');
  }

  setContactForm(field: keyof IContactForm, value: string) {
    this.order[field] = value;
    if (this.validateContactForm()) {
      this.events.emit('contacts:ready', this.order);
    }
  }

  setOrderForm(field: keyof IOrderForm, value: PaymentMethod) {
    this.order[field] = value;
    if (this.validateOrderForm()) {
      this.events.emit('order:ready', this.order);
    }
  }

  validateContactForm() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) errors.email = 'Укажите email';
    if (!this.order.phone) errors.phone = 'Указажите номер телефона';

    this.formErrors = errors;
    this.events.emit('formError:changed', this.formErrors);

    return Object.keys(errors).length === 0;
  }

  validateOrderForm() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) errors.address = 'Укажите адрес доставки';

    this.formErrors = errors;
    this.events.emit('orderError:changed', this.formErrors);

    return Object.keys(errors).length === 0;
  }

  handleBasketAction(action: string, item: Product): void {
    switch (action) {
      case 'add':
        if (!this.basket.includes(item)) this.basket.push(item);
        break;
      case 'delete':
        this.basket = this.basket.filter(elem => elem !== item);
        break;
    }

    this.refreshBasket();
  }
}


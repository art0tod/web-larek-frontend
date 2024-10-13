// Базовые типы
export type Id = string;
export type Price = number;

// Перечисления
export enum Category {
  SoftSkill = 'софт-скил',
  HardSkill = 'хард-скил',
  Additional = 'дополнительное',
  Button = 'кнопка',
  Other = 'другое'
}

export enum PaymentMethod {
  Card = 'card',
  Cash = 'cash'
}

export interface IProduct {
  id: Id;
  description: string;
  image: string;
  title: string;
  category: Category;
  price: Price | null;
}

export interface IProductList {
  total: number;
  items: IProduct[];
}

export interface IOrder {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: Price;
  items: Id[];
}

export interface IOrderResponse {
  id: Id;
  total: Price;
}

export interface IAPIClient {
  getProductList: () => Promise<IProductList>;
  getProductItem: (id: Id) => Promise<IProduct>;
  createOrder: (order: IOrder) => Promise<IOrderResponse>;
}

export interface ICatalogModel {
  products: IProduct[];
  getList: () => Promise<void>;
  getItem: (id: Id) => Promise<IProduct>;
}

export interface IBasketModel {
  items: Map<Id, IProduct>;
  add: (item: IProduct) => void;
  remove: (id: Id) => void;
  clear: () => void;
  getTotal: () => Price;
}

export interface IOrderModel {
  orderData: IOrder;
  savePaymentMethod: (method: PaymentMethod) => void;
  saveDeliveryAddress: (address: string) => void;
  saveContacts: (email: string, phone: string) => void;
  setItems: (items: IProduct[]) => void;
  validateOrder: () => boolean;
  sendOrder: () => Promise<IOrderResponse>;
}

export interface IProductCardView {
  product: IProduct;
  render: () => HTMLElement;
  onClick: (callback: (product: IProduct) => void) => void;
}

export interface IBasketView {
  items: IProduct[];
  render: () => HTMLElement;
  update: (items: IProduct[]) => void;
  onRemove: (callback: (id: Id) => void) => void;
}

export interface IOrderFormView {
  render: () => HTMLElement;
  setPaymentMethod: (method: PaymentMethod) => void;
  setDeliveryAddress: (address: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  showErrors: (errors: string[]) => void;
  onSubmit: (callback: (formData: IOrder) => void) => void;
}

export interface IModalView {
  content: HTMLElement;
  render: () => HTMLElement;
  open: () => void;
  close: () => void;
  onClose: (callback: () => void) => void;
}

export interface IAppState {
  catalog: ICatalogModel;
  basket: IBasketModel;
  order: IOrderModel;
  modal: IModalView | null;
}

export interface IApp {
  state: IAppState;
  api: IAPIClient;
  init: () => Promise<void>;
}

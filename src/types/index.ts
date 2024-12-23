// Базовые типы
export type Id = string;
export type Price = number;
export type FormErrors = Partial<Record<keyof IOrder, string>>;


// Перечисления
export enum Category {
  SoftSkill = 'софт-скил',
  HardSkill = 'хард-скил',
  Additional = 'дополнительное',
  Button = 'кнопка',
  Other = 'другое'
}

export enum PaymentMethod {
  card = 'card',
  cash = 'cash'
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

export interface IOrderSuccess {
  total: Price;
}

export interface IAPIClient {
  getProductList: () => Promise<IProduct[]>;
  getProductItem: (id: Id) => Promise<IProduct>;
  createOrder: (order: IOrder) => Promise<IOrderSuccess>;
}

// Model

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
  update: (items: IProduct[]) => void;
}

export interface IOrderModel {
  orderData: IOrder;
  total: Price;
  savePaymentMethod: (method: PaymentMethod) => void;
  saveDeliveryAddress: (address: string) => void;
  saveContacts: (email: string, phone: string) => void;
  setItems: (items: IProduct[]) => void;
  validateOrder: () => boolean;
  sendOrder: () => Promise<IOrderSuccess>;
}

// View

export interface IProductCardView {
  product: IProduct;
  render: () => HTMLElement;
  onClick: (callback: (product: IProduct) => void) => void;
}

export interface IBasketView {
  items: IProduct[];
  render: () => HTMLElement;
  onUpdate: (callback: () => void) => void;
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
  preview: string | null;
  modal: IModalView | null;
}

export interface IMainPage {
  catalog: HTMLElement[];
  total: number;
}

export interface IApp {
  state: IAppState;
  api: IAPIClient;
  init: () => Promise<void>;
}

export interface IContactForm {
  phone: string;
  email: string;
}

export interface IOrderForm {
  payment: string;
  address: string;
}

export interface IOrderSuccessAction {
  onClick: () => void;
}

export interface ICard extends IProduct {
  index?: string;
  buttonText: string;
}

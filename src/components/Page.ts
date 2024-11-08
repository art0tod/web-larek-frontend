import { IMainPage } from '../types'
import { ensureElement } from '../utils/utils'
import { Component } from './base/Component'
import { IEvents } from './base/events'

export class Page extends Component<IMainPage> {
  protected _total: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._total = ensureElement('.header__basket-counter');
    this._catalog = ensureElement('.gallery');
    this._wrapper = ensureElement('.page__wrapper');
    this._basket = ensureElement('.header__basket');

    this._basket.addEventListener('click', this.handleBasket)
  }

  private handleBasket = () => {
    this.events.emit('basket:open')
  }

  set total(value: number) {
    this.setText(this._total, value)
  }

  set catalog(items: HTMLElement[]) {
    this._catalog.innerHTML = '';
    this._catalog.append(...items);
  }

  set locked(value: boolean) {
    this._wrapper.classList.toggle('page__wrapper_locked', value)
  }
}

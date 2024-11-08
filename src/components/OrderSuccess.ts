import { ensureElement } from '../utils/utils';
import { Component } from './base/Component'
import { IOrderSuccess, IOrderSuccessAction } from '../types'

export class Success extends Component<IOrderSuccess> {
  protected _close: HTMLElement;
  protected _text: HTMLElement;

  constructor(container: HTMLElement, actions: IOrderSuccessAction) {
    super(container);

    this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
    this._text = ensureElement<HTMLElement>('.order-success__description', this.container);

    if (actions?.onClick) {
      this._close.addEventListener('click', actions.onClick);
    }
  }

  get text(): string {
    return this._text.textContent;
  }

  set text(value: string) {
    this.setText(this._text, `Списано ${value} синапсов`);
  }
}

import { IOrder } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form'

interface IActions {
  onClick: (event: MouseEvent) => void;
}

export class Order extends Form<IOrder> {
  protected _paymentButtonCash: HTMLButtonElement;
  protected _paymentButtonCard: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
    super(container, events);

    this._paymentButtonCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this._paymentButtonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this._paymentButtonCard.classList.add('button_alt-active');

    if (actions?.onClick) this.addButtonClickHandler(actions.onClick);
  }

  private addButtonClickHandler(onClick: (event: MouseEvent) => void) {
    if (onClick) {
      this._paymentButtonCash.addEventListener('click', onClick);
      this._paymentButtonCard.addEventListener('click', onClick);
    }
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  toggleButton(toggle: HTMLElement) {
    this._paymentButtonCard.classList.toggle('buttton_alt-active', toggle === this._paymentButtonCard);
    this._paymentButtonCash.classList.toggle('buttton_alt-active', toggle === this._paymentButtonCash);
  }
}

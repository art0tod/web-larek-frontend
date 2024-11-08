import { Component } from './base/Component';
import { Category, ICard, IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { validate } from 'webpack';
import { cardCategory } from '../utils/constants';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
  protected _id?: HTMLElement;
  protected _description?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _title: HTMLElement;
  protected _category?: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);

    this._id = container.querySelector('.basket__item-index');
    this._description = container.querySelector('.card__text');
    this._image = container.querySelector('.card__image');
    this._category = container.querySelector('.card__category');

    if (actions?.onClick && this._button) {
      this._button.addEventListener('click', actions.onClick);
    } else if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    }
  }

  disableButton(value: number | null) {
    if (value === null && this._button) {
      this._button.disabled = true;
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set description(value: string) {
    this.setText(this._description, value);
  } 

  get description(): string {
    return this._description.textContent || '';
  }

  get title(): string {
    return this._title.textContent || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get category(): Category | null {
    const text = this._category.textContent?.trim();
    return Object.values(Category).find(value => value === text);
  }

  set category(value: Category) {
    this.setText(this._category, value);
    this._category.classList.add(cardCategory[value]);
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  set buttonText(value: string) {
    if (this._button) this.setText(this._button, value)
  }

  get buttonText(): string {
    return this._button.textContent || '';
  }
  
}

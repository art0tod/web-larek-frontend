import './scss/styles.scss';
import { Basket } from './components/Basket';
import { Card } from './components/Card';
import { ContactForm } from './components/ContactForm';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { APIClient } from './components/API';
import { EventEmitter } from './components/base/events';
import Modal, { } from './components/common/Modal';
import { Success } from './components/OrderSuccess';
import { Category, IContactForm, IOrderForm, IProduct, PaymentMethod } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import AppState, { CatalogChangeEvent } from './components/AppState';
import { transform } from 'terser-webpack-plugin/types/minify';
import Product from './components/Product';

const api = new APIClient(CDN_URL, API_URL);
const events = new EventEmitter();

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successOrderTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');


// Модель данных
const appState = new AppState({}, events);


// Глобальные контейнеры
const page = new Page(document.body, events);
const modalContainer = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events, {
  onClick: (ev: Event) => events.emit('payment:change', ev.target)
});
const contactForm = new ContactForm(cloneTemplate(contactsTemplate), events);


// Бизнес-логика
function handleProductsChanged() {
  page.catalog = appState.catalog.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render({
      title: item.title,
      category: item.category,
      price: item.price,
      image: item.image
    })
  })
}

function scrollBlock() {
  page.locked = true;
}

function scrollUnblock() {
  page.locked = false;
}

function handlePreviewUpdate(item: Product) {
  const card = new Card(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit('product:toggle', item);
      card.buttonText = (appState.basket.indexOf(item) < 0)
        ? 'В корзину'
        : 'Удалить из корзины'
    }
  });

  const buttonText = (appState.basket.indexOf(item) < 0)
    ? 'В корзину'
    : 'Удалить из корзины'

  card.buttonText = buttonText;

  modalContainer.render({
    content: card.render({
      title: item.title,
      category: item.category,
      price: item.price,
      image: item.image,
      description: item.description,
      buttonText: buttonText,
    })
  })
}

function handleBasketOpen() {
  modalContainer.render({
    content: basket.render({})
  })
}

function handleProductToggle(item: Product) {
  appState.basket.indexOf(item) < 0
    ? events.emit('product:add', item)
    : events.emit('product:delete', item)
}

function handleProductAdd(item: Product) {
  appState.handleBasketAction('add', item);
}

function handleProductDelete(item: Product) {
  appState.handleBasketAction('delete', item);
}

function handleBasketChanged(items: Product[]) {
  basket.items = items.map((item, index) => {
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit('product:delete', item);
      }
    });
    return card.render({
      index: (index + 1).toString(),
      title: item.title,
      price: item.price,
    });
  });

  const total = items.reduce((total, item) => total + item.price, 0);
  basket.total = total;
  appState.total = total;
  basket.toggleButton(total === 0);
}

function handleCounterChanged(item: string[]) {
  page.counter = appState.basket.length;
}

function handleOrderOpen() {
  modalContainer.render({
    content: order.render({
      address: '',
      payment: PaymentMethod.card,
      valid: false,
      errors: []
    })
  })

  appState.order.items = appState.basket.map(item => item.id);
}

function handleContactOpen() {
  modalContainer.render({
    content: contactForm.render({
      email: '',
      phone: '',
      valid: false,
      errors: []
    })
  })
}

function handleFormErrorChanged(errors: Partial<IContactForm>) {
  const { phone, email } = errors;
  order.valid = !email && !phone;
  contactForm.errors = Object.values({ phone, email }).filter(i => !!i).join('; ')
}

function handleOrderErrorChanged(errors: Partial<IOrderForm>) {
  const { payment, address } = errors;
  order.valid = !payment && !address;
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
}

function handleOrderReady() {
  order.valid = true;
}

function handleContactReady() {
  contactForm.valid = true;
}

function handleContactSubmit() {
  api.createOrder(appState.order)
    .then((result) => {
      appState.clearBasket();
      appState.clearOrder();
      page.counter = appState.basket.length;
      const success = new Success(cloneTemplate(successOrderTemplate), {
        onClick: () => {
          modalContainer.close();
        }
      });
      success.text = result.total.toString();

      modalContainer.render({
        content: success.render({})
      });
    })
    .catch(err => {
      console.error(err);
    });
}

function handlePaymentChange(target: HTMLElement) {
  if (!target.classList.contains('button_alt-active')) {
    order.toggleButton(target);
    const paymentType = target.getAttribute('name') as keyof typeof PaymentMethod;
    appState.order.payment = PaymentMethod[paymentType];
  }
}

function handleOrderChange(data: { field: keyof IOrderForm, value: PaymentMethod }) {
  appState.setOrderForm(data.field, data.value)
}

function handleContactsChange(data: { field: keyof IContactForm, value: string }) {
  appState.setContactForm(data.field, data.value)
}

function handleOrderSubmit() {
  events.emit('contact:open');
}


// Подписки на события
events.on('card:select', handlePreviewUpdate);
events.on('modal:close', scrollUnblock);
events.on('product:toggle', handleProductToggle);
events.on('product:add', handleProductAdd);
events.on('product:delete', handleProductDelete);
events.on('modal:open', scrollBlock);
events.on('basket:open', handleBasketOpen);
events.on('order:open', handleOrderOpen);
events.on<CatalogChangeEvent>('products:changed', handleProductsChanged);
events.on('basket:changed', handleBasketChanged);
events.on('counter:changed', handleCounterChanged);
events.on('contact:open', handleContactOpen);
events.on('formError:changed', handleFormErrorChanged);
events.on('orderError:changed', handleOrderErrorChanged);
events.on(/^order\..*:change/, handleOrderChange);
events.on(/^contacts\..*:change/, handleContactsChange);
events.on('preview:changed', handlePreviewUpdate);
events.on('payment:change', handlePaymentChange);
events.on('order:ready', handleOrderReady);
events.on('contacts:ready', handleContactReady);
events.on('order:submit', handleOrderSubmit);
events.on('contacts:submit', handleContactSubmit);
events.on('contacts:error', () => {
  contactForm.valid = false;
});

// Получение всех товаров с сервера
api.getProductList()
  .then(catalog => appState.setCatalog(catalog))
  .catch(err => console.log(err))


// Мониторинг событий
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})
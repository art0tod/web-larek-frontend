# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание базовых типов

### Слой Модели

#### Класс CatalogModel

Модель каталога продуктов.

##### Конструкток

Не принимает параматры. Инициализирует пустой список товаров.

##### Поля

- `product: IProduct[]` - массив продуктов, который хранит данные каталога.

##### Методы

- `getList: () => Promise<void>` - загружает список продуктов из API и обновляет поле `products`.
- `getItem: (id: Id) => Promise<IProduct>` - возвращает данные конкретного продукта по Id.

#### Класс BasketModel

Модель корзины.

##### Конструкток

Создаёт пустую карзину с коллекцией, где ключ `Id` - товара и значение - объект товара.

##### Поля

- `items: Map<Id, IProduct>` - коллекция товаров в корзине.

##### Методы

- `add: (item: IProduct)` - добавляет товар в корзину.
- `remove: (id: Id)` - удаляет товара по Id из корзины.
- `clear` - очищает корзину.
- `getTotal` - возвращает общую стоимость товаров в корзине.

#### Класс OrderModel

Модель для работы с заказом.

##### Конструктор

Инициализирует пустые поля заказа.

##### Поля

- `orderData: IOrder` - объект данных заказа.

##### Методы

- `savePaymentMethod: (method: PaymentMethod)` - сохраняет выбранный способ оплаты в заказ.
- `saveDeliveryAddress: (adress: string)` - сохраняет адрес доставки.
- `saveContact: (email: string, phone: string)` - сохраняет контактные данные.
- `setItems: (item: IProduct[])` - устанавливает список товаров для создания заказа.
- `validateOrder` - проверяет корректность данных заказа.
- `sendOrder: () => Promise<IOrderResponse` - отправляет заказ в API и возвращает созданный заказ.

### Слой представления

#### Класс ProductCardView

Компонент представления карточки товара.

##### Поля

- `product: IProduct[]` - данные товара.

##### Методы

- `render: (HTMLElement)` - создаёт разметку карточки товара.
- `onClick (callback: (product: IProduct) => void)` - обрабатывает событие клика по карточке.

#### Класс IBasketView

Компонент представления корзин.

##### Поля

- `items: IProduct[]` - список товаров в корзине.

##### Методы

- `render: () => HTMLElement` - создаёт разметку корзины.
- `update: (items: IProduct[])` - обновляет содержимое корзины.
- `onRemove: (callback: (id: Id) => void)` - обрабатывает событие удаления товара из корзины.

#### Класс OrderFormView

Компонент представления формы заказа.

##### Методы

- `render: () => HTMLElement` - создаёт разметку формы заказа.
- `setPaymentMethod: (method: PaymentMethod)` - устанавливает способ оплаты.
- `setDeliveryAddress: (address: string)` - устанавливает адрес доставки.
- `setEmail: (email: string)` - устанавливает адрес электронной почты.
- `setPhone: (phone: string)` - устанавливает номер телефона.
- `showErrors: (errors: string[])` - отображает ошибки валидации формы.
- `onSubmit: (callback: (formData: IOrder) => void)` - обрабатывает отправку формы.

#### Класс ModalView

Компонент модального окна.

##### Поля

- `content: HTMLElement` - содержимое модального окна.

##### Методы

- `render: () => HTMLElement` - создаёт разметку модального окна.
- `open` - открывает модальное окно.
- `close` - закрывает модальное окно.
- `onClose: (callback: () => void)` - обрабатывает закрытие окна.

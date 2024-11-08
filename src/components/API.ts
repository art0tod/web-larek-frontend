import { IAPIClient, IOrder, IOrderSuccess, IProduct } from '../types'
import { Api, ApiListResponse } from './base/api'

export class APIClient extends Api implements IAPIClient {
  readonly cdn: string;

  constructor(cdn: string, baseURL: string, options?: RequestInit) {
    super(baseURL, options);
    this.cdn = cdn;
  }

  getProductItem: (id: string) => Promise<IProduct> = (id: string) => {
    return this.get(`/product/${id}`)
    .then((item: IProduct) => ({
      ...item,
      image: this.cdn + item.image
    }))
  }

  getProductList: () => Promise<IProduct[]> = () => {
    return this.get('/product')
    .then((data: ApiListResponse<IProduct>) => 
          data.items.map(item => ({
            ...item,
            image: this.cdn + item.image,
          })))   
  };

  createOrder: (order: IOrder) => Promise<IOrderSuccess> = (order: IOrder) => {
    return this.post('/order', order)
    .then((data: IOrderSuccess) => data)
  };
}

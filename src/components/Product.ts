import { Model } from "./base/Model";
import { Category, IProduct, Id, Price } from "../types";

export default class Product extends Model<IProduct> {
  id: Id;
  description: string;
  image: string;
  title: string;
  category: Category;
  price: Price | null;
}

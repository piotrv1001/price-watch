import { Price } from "../price/price";

export class Product {
  id?: string;
  productId?: string;
  name?: string;
  seller?: string;
  link?: string;
  imgSrc?: string;
  promo?: boolean;
  prices?: Price[];
}

import { ProductWithPrice } from "./product-with-price";

export class ProductWithPriceChange extends ProductWithPrice {
  oldPrice?: number;
  priceChange?: number;
  priceChangePercentage?: number;
}

import { Product } from "src/app/models/product/product";

export interface PriceLegend {
  index: number;
  product: Product;
  color: string;
}

import { Product } from 'src/product/product.entity';

export class ProductWithPrice extends Product {
  currentPrice?: number;
}

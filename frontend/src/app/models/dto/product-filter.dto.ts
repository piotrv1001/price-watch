import { Promo } from "src/app/components/product-filter/promo-filter/promo-filter.component";

export class ProductFilterDTO {
  sellers?: string[];
  statusList?: number[];
  minPrice?: number;
  maxPrice?: number;
  minBuyers?: number;
  maxBuyers?: number;
  promo?: Promo;
  newProductsOnly?: boolean;
  priceChangesOnly?: boolean;
}

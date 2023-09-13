export type Promo = 'all' | 'promo' | 'non-promo';

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

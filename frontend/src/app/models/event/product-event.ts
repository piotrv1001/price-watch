export class ProductEvent {
  date?: Date;
  currentPrice?: number;
  prevPrice?: number;
  priceChangePercentage?: number;
  imgSrc?: string;
  type?: 'new-product' | 'withdrawn' | 'price-change' | 're-activated';
}

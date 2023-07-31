import { NewProductDTO } from './new-product.dto';

export class PriceChangeDTO extends NewProductDTO {
  prevPrice?: number;
  priceChange?: number;
  priceChangePercentage?: number;
}

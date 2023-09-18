import { Bucket } from 'src/bucket';
import { ProductWithPrice } from './product-with-price';

export class SellerInfoDTO {
  total?: number;
  promoted?: number;
  dominantBucket?: Bucket;
  averagePrice?: number;
  bestSellingProducts?: ProductWithPrice[];
  mostExpensiveProduct?: ProductWithPrice;
  leastExpensiveProduct?: ProductWithPrice;
}

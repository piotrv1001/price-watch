import { ProductWithPrice } from './product-with-price';
import { BucketInfoDTO } from './bucket-info.dto';

export class SellerInfoDTO {
  total?: number;
  promoted?: number;
  averagePrice?: number;
  bestSellingProducts?: ProductWithPrice[];
  bucketInfo?: BucketInfoDTO;
}

import { ProductWithPrice } from "../product/product-with-price";
import { BucketInfoDTO } from "./bucket-info.dto";

export class SellerInfo {
  total?: number;
  promoted?: number;
  averagePrice?: number;
  bestSellingProducts?: ProductWithPrice[];
  bucketInfo?: BucketInfoDTO;
}

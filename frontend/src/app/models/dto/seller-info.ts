import { Bucket } from "src/app/types/histogram/bucket";
import { ProductWithPrice } from "../product/product-with-price";

export class SellerInfo {
  total?: number;
  promoted?: number;
  dominantBucket?: Bucket;
  averagePrice?: number;
  bestSellingProducts?: ProductWithPrice[];
  mostExpensiveProduct?: ProductWithPrice;
  leastExpensiveProduct?: ProductWithPrice;
}

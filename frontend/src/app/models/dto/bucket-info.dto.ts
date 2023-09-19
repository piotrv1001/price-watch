import { Bucket } from "src/app/types/histogram/bucket";

export class BucketInfoDTO {
  dominantBucket?: Bucket;
  dominantBucketProducts?: number;
  dominantBucketPercentage?: number;
}

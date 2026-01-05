import { ENV } from "../config";
import { S3Service, SqsService } from "../common-svc";

(async () => {
  try {
    await S3Service.createBucket(ENV.S3_RAW_BUCKET),
      await S3Service.createBucket(ENV.S3_PROCESSED_BUCKET),
      await SqsService.createQueue(ENV.SQS_VIDEO_QUEUE),
      console.log("INFRA READY!!");
  } catch (error) {
    console.log("INFRA NOT READY", error);
  }
})();

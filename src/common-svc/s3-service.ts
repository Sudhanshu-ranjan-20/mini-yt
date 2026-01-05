import {
  CreateBucketCommand,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { ENV } from "../config";
class S3Service {
  private S3Config: S3ClientConfig;
  private S3Client: S3Client;
  constructor() {
    this.S3Config = {
      region: ENV.AWS_REGION,
      endpoint: ENV.AWS_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: ENV.AWS_ACCESS_KEY_ID,
        secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
      },
    };

    this.S3Client = new S3Client(this.S3Config);
  }

  async createBucket(name: string): Promise<string | undefined> {
    try {
      const res = await this.S3Client.send(
        new CreateBucketCommand({ Bucket: name })
      );

      return res.Location;
    } catch (error: any) {
      if (error.name === "BucketAlreadyOwnedByYou") {
        console.log("Bucket already exists!");
        return;
      }
      console.error("Error creating in bucket", error);
    }
  }
}

export default new S3Service();

import {
  CreateBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { ENV } from "../config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "../utilities";
import { inspect } from "util";

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

  async getSignedUploadUrl({
    key,
    contentType,
    expiresIn = 3600,
  }: {
    key: string;
    contentType: string;
    expiresIn?: number;
  }): Promise<string> {
    try {
      logger.info("S3Service.getSignedUploadUrl called::");
      const command = new PutObjectCommand({
        Bucket: ENV.S3_RAW_BUCKET,
        Key: key,
        ContentType: contentType,
      });

      return await getSignedUrl(this.S3Client, command, { expiresIn });
    } catch (error) {
      logger.error("S3Service.getSignedUploadUrl error::", inspect(error));
      throw error;
    }
  }

  async assetExists(key: string): Promise<boolean> {
    try {
      logger.info("S3Service.assetExists called::");
      await this.S3Client.send(
        new HeadObjectCommand({
          Bucket: ENV.S3_RAW_BUCKET,
          Key: key,
        })
      );

      return true;
    } catch (error: any) {
      if (
        error?.name === "NotFound" ||
        error?.$metadata?.httpStatusCode === 404
      ) {
        return false;
      }
      logger.error("S3Service.assetExists error::", inspect(error));
      throw error;
    }
  }
}

export default new S3Service();

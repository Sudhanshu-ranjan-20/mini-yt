import {
  CreateQueueCommand,
  SQSClient,
  SQSClientConfig,
  CreateQueueCommandInput,
  GetQueueUrlCommand,
} from "@aws-sdk/client-sqs";
import { ENV } from "../config";
class SqsService {
  private sqsConfig: SQSClientConfig;
  private sqsClient: SQSClient;
  constructor() {
    this.sqsConfig = {
      region: ENV.AWS_REGION,
      endpoint: ENV.AWS_ENDPOINT,
      credentials: {
        accessKeyId: ENV.AWS_ACCESS_KEY_ID,
        secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
      },
    };

    this.sqsClient = new SQSClient(this.sqsConfig);
  }

  async createQueue(name: string): Promise<String | undefined> {
    try {
      const isFifo = name.endsWith(".fifo");
      const inputData: CreateQueueCommandInput = {
        QueueName: name,
        Attributes: {
          ...(isFifo && {
            FifoQueue: "true",
            ContentBasedDeduplication: "true",
          }),
        },
      };
      const res = await this.sqsClient.send(new CreateQueueCommand(inputData));
      if (!res.QueueUrl) throw new Error("Queue URL not returned by SQS");
      return res.QueueUrl;
    } catch (error: any) {
      if (error.name === "QueueAlreadyExists") {
        // attributes mismatch
        console.warn(
          `Queue "${name}" already exists with different attributes`
        );
        return;
      }
      console.error("Queue cannot be created", error);
    }
  }
}

export default new SqsService();

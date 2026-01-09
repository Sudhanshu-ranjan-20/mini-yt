import {
  CreateQueueCommand,
  SQSClient,
  SQSClientConfig,
  CreateQueueCommandInput,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";
import { ENV, logger } from "@mini-yt/shared";
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
      logger.info("SqsService.createQueue called::");
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
      logger.error("SqsService.createQueue error::", error);
      throw error;
    }
  }

  async sendEvent({
    payload,
    queueUrl,
  }: {
    payload: any;
    queueUrl: string;
  }): Promise<void> {
    try {
      logger.info("SqsService.sendEvent called::");
      await this.sqsClient.send(
        new SendMessageCommand({
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(payload),
        })
      );
    } catch (error) {
      logger.error("SqsService.error called:::");
    }
  }
}

export default new SqsService();

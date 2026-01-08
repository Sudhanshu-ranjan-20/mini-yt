import "dotenv/config";

function must(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`MISSING env : ${name}`);
  return v;
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "local",
  PORT: Number(process.env.PORT ?? "4000"),
  QUEUE_BASE_URL:
    process.env.QUEUE_BASE_URL ??
    "http://sqs.ap-south-1.localhost.localstack.cloud:4566/000000000000",

  DATABASE_URL: must("DATABASE_URL"),

  AWS_REGION: must("AWS_REGION"),
  AWS_ENDPOINT: must("AWS_ENDPOINT"),
  AWS_ACCESS_KEY_ID: must("AWS_ACCESS_KEY_ID"),
  AWS_SECRET_ACCESS_KEY: must("AWS_SECRET_ACCESS_KEY"),

  S3_RAW_BUCKET: must("S3_RAW_BUCKET"),
  S3_PROCESSED_BUCKET: must("S3_PROCESSED_BUCKET"),

  SQS_VIDEO_QUEUE: must("SQS_VIDEO_QUEUE"),

  JWT_SECRET: must("JWT_SECRET"),

  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL ?? "15m",
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL ?? 14,
};

export const CONFIG = {
  QUEUES_URL: {
    VIDEO_PROCESSING: `${ENV.QUEUE_BASE_URL}/${ENV.SQS_VIDEO_QUEUE}`,
  },
};

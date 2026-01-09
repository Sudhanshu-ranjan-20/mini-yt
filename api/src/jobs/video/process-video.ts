import { TProcessVideoPayload } from "./types";
import fs from "fs/promises";
import { S3Service } from "../../common-svc";
import { transcodeToMp4 } from "./ffmpeg";
import path from "path";

export async function processVideo(payload: TProcessVideoPayload) {
  const tmpDir = path.join("/tmp", payload.videoId);
  await fs.mkdir(tmpDir, { recursive: true });

  const rawPath = path.join(tmpDir, "raw");
  const outPath = path.join(tmpDir, "processed.mp4");
  const processedKey = `${payload.videoId}/processed.mp4`;

  try {
  } catch (error) {}
}

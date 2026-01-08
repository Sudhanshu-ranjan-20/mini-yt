import { processVideo } from "../jobs/video/process-video";
import { WorkerMessage } from "./types";

export async function dispatchMessage(message: WorkerMessage) {
  switch (message.type) {
    case "VIDEO_PROCESS":
      return processVideo(message.payload);
    default:
      throw new Error("Unknown job type");
  }
}

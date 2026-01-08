import { spawn } from "child_process";

export function transcodeToMp4(
  inputPath: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-i",
      inputPath,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "28",
      "-c:a",
      "aac",
      "-movflags",
      "+faststart",
      outputPath,
    ]);

    ffmpeg.on("close", (code) =>
      code == 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`))
    );
  });
}

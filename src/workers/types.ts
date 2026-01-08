export type WorkerMessage =
  | {
      type: "VIDEO_PROCESS";
      payload: {
        videoId: string;
        rawKey: string;
      };
    }
  | {
      type: "CLEANUP";
      payload: {
        force: boolean;
      };
    };

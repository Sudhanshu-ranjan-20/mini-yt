import { Knex as IKnex } from "knex";
import { CONSTANTS } from "@mini-yt/shared";

const {
  DATABASE: { DEFAULTS, TABLES },
} = CONSTANTS;

class VideoRepository {
  private db: IKnex;
  private TB_VIDEOS = `${DEFAULTS.SCHEMA}.${TABLES.TB_VIDEOS}`;
  private returningFields = [
    "channel",
    "title",
    "description",
    "status",
    "raw_s3_key",
  ];
  constructor(db: IKnex) {
    this.db = db;
  }

  create(videoBody: {}) {
    return this.db(this.TB_VIDEOS)
      .insert({ ...videoBody })
      .returning(this.returningFields);
  }
  get(conditions: {}) {
    return this.db(this.TB_VIDEOS)
      .where({ ...conditions })
      .returning(this.returningFields)
      .first();
  }
  update({ id, updateBody }: { id: string; updateBody: {} }) {
    return this.db(this.TB_VIDEOS)
      .update({ ...updateBody })
      .where({ id });
  }
}
export default VideoRepository;

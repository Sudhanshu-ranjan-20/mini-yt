import { Knex as IKnex } from "knex";
import { DEFAULTS, TABLES } from "../../db/constants";

class VideoRepository {
  private db: IKnex;
  private TB_VIDEOS = `${DEFAULTS.SCHEMA}.${TABLES.TB_VIDEOS}`;
  constructor(db: IKnex) {
    this.db = db;
  }
}
export default VideoRepository;

import { Knex as Iknex } from "knex";
import { CONSTANTS, types } from "@mini-yt/shared";

const { DEFAULTS, TABLES } = CONSTANTS.DATABASE;
class ChannelRepository {
  private db: Iknex;
  private tbChannel: string = `${DEFAULTS.SCHEMA}.${TABLES.TB_CHANNEL}`;
  private returningFields = ["name", "owner", "handle", "id", "created_at"];
  constructor(db: Iknex) {
    this.db = db;
  }

  createChannel(channelBody: types.schema.channel.IChannel) {
    return this.db(this.tbChannel)
      .insert(channelBody)
      .returning(this.returningFields);
  }
  getChannel(conditions: types.schema.channel.IGetChannel) {
    return this.db(this.tbChannel)
      .where({ ...conditions })
      .first();
  }
}

export default ChannelRepository;

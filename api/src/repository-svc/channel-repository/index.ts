import { Knex as Iknex } from "knex";
import { DEFAULTS, TABLES } from "../../db/constants";
import { IChannel, TGetChannelParams } from "../../schemas/channel-schema";
class ChannelRepository {
  private db: Iknex;
  private tbChannel: string = `${DEFAULTS.SCHEMA}.${TABLES.TB_CHANNEL}`;
  private returningFields = ["name", "owner", "handle", "id", "created_at"];
  constructor(db: Iknex) {
    this.db = db;
  }

  createChannel(channelBody: IChannel) {
    return this.db(this.tbChannel)
      .insert(channelBody)
      .returning(this.returningFields);
  }
  getChannel(conditions: TGetChannelParams) {
    return this.db(this.tbChannel)
      .where({ ...conditions })
      .first();
  }
}

export default ChannelRepository;

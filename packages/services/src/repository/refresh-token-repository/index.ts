import { Knex as Iknex } from "knex";
import { CONSTANTS } from "@mini-yt/shared";

const {
  DATABASE: { DEFAULTS, TABLES },
} = CONSTANTS;

class RefreshTokenRepository {
  private db: Iknex;
  private TB_REFRESH_TOKEN = `${DEFAULTS.SCHEMA}.${TABLES.TB_REFRESH_TOKEN}`;
  private returningFields = ["*"];
  constructor(db: Iknex) {
    this.db = db;
  }

  createRefreshToken(body: {}) {
    return this.db(this.TB_REFRESH_TOKEN)
      .insert(body)
      .returning(this.returningFields);
  }
  getValidRefreshTokens() {
    return this.db(this.TB_REFRESH_TOKEN).where(
      "expires_at",
      ">",
      this.db.fn.now()
    );
  }
  deleteRefrehToken(deleteCondition: {}) {
    return this.db(this.TB_REFRESH_TOKEN)
      .where({ ...deleteCondition })
      .delete();
  }
}
export default RefreshTokenRepository;

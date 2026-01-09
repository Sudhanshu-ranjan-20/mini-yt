import { Knex as Iknex } from "knex";
import { DEFAULTS, TABLES } from "../../db/constants";

class UserRepository {
  private db: Iknex;
  private returningObject = ["id", "email"];
  private TB_USER = `${DEFAULTS.SCHEMA}.${TABLES.TB_USER}`;

  constructor(db: Iknex) {
    this.db = db;
  }
  getUserByConditions(conditionObject: {}) {
    return this.db(this.TB_USER)
      .where({ ...conditionObject })
      .returning(this.returningObject)
      .first();
  }
  createUser(userBody: {}) {
    return this.db(this.TB_USER)
      .insert(userBody)
      .returning(this.returningObject);
  }
}
export default UserRepository;

import { Knex } from "knex";
import { CONSTANTS } from "@mini-yt/shared";
const { DEFAULTS, ENUMS, TABLES } = CONSTANTS.DATABASE;
const { TB_REFRESH_TOKEN, TB_USER } = TABLES;
const { SCHEMA } = DEFAULTS;

const createRefreshTokenTable = async (knex: Knex) => {
  const tblExists = await knex.schema
    .withSchema(SCHEMA)
    .hasTable(TB_REFRESH_TOKEN);
  if (tblExists) return;
  await knex.schema.withSchema(SCHEMA).createTable(TB_REFRESH_TOKEN, (tbl) => {
    tbl.uuid("id").primary().defaultTo(knex.raw("uuidv7()"));
    tbl
      .uuid("user")
      .references("id")
      .inTable(`${SCHEMA}.${TB_USER}`)
      .notNullable()
      .onDelete("CASCADE");
    tbl.text("token_hash").notNullable();
    tbl.timestamp("expires_at").notNullable();
    tbl.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    tbl.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
};
export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await createRefreshTokenTable(trx);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.schema.withSchema(SCHEMA).dropTableIfExists(TB_REFRESH_TOKEN);
  });
}

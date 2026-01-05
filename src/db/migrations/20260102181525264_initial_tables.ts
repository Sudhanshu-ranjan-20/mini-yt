import { Knex } from "knex";
import { DEFAULTS, ENUMS, TABLES } from "../constants";
const { TB_USER, TB_CHANNEL, TB_VIDEOS } = TABLES;
const { SCHEMA } = DEFAULTS;

async function createUserTable(knex: Knex): Promise<void> {
  const tbUser = await knex.schema.withSchema(SCHEMA).hasTable(TB_USER);
  if (!tbUser)
    await knex.schema.withSchema(SCHEMA).createTable(TB_USER, (tbl) => {
      tbl.uuid("id").primary().defaultTo(knex.raw(`uuidv7()`));
      tbl.text("email").unique().notNullable();
      tbl.string("password").notNullable();
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
      tbl.timestamp("updated_at").defaultTo(knex.fn.now());
      tbl.boolean("is_deleted").defaultTo(false);
    });
}
async function createChannelTable(knex: Knex): Promise<void> {
  const tbChannel = await knex.schema.withSchema(SCHEMA).hasTable(TB_CHANNEL);
  if (!tbChannel)
    await knex.schema.withSchema(SCHEMA).createTable(TB_CHANNEL, (tbl) => {
      tbl.uuid("id").primary().defaultTo(knex.raw(`uuidv7()`));
      tbl
        .uuid("owner")
        .references("id")
        .inTable(`${SCHEMA}.${TB_USER}`)
        .notNullable();
      tbl.text("name").notNullable();
      tbl.text("handle").unique().notNullable();
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
      tbl.timestamp("updated_at").defaultTo(knex.fn.now());
      tbl.boolean("is_deleted").defaultTo(false);
    });
}
async function createVideosTable(knex: Knex): Promise<void> {
  const tbVideos = await knex.schema.withSchema(SCHEMA).hasTable(TB_VIDEOS);
  if (!tbVideos)
    await knex.schema.withSchema(SCHEMA).createTable(TB_VIDEOS, (tbl) => {
      tbl.uuid("id").primary().defaultTo(knex.raw(`uuidv7()`));
      tbl
        .uuid("channel")
        .references("id")
        .inTable(`${SCHEMA}.${TB_CHANNEL}`)
        .notNullable();
      tbl.text("title").notNullable();
      tbl.text("description");
      tbl.enu("visibility", ENUMS.VISIBILITY).defaultTo(DEFAULTS.VISIBILITY);
      tbl.enu("status", ENUMS.STATUS).defaultTo(DEFAULTS.STATUS);

      tbl.text("raw_location").notNullable();
      tbl.text("processed_prefix");
      tbl.bigint("duration");

      tbl.timestamp("created_at").defaultTo(knex.fn.now());
      tbl.timestamp("published_at");
      tbl.timestamp("updated_at").defaultTo(knex.fn.now());
      tbl.boolean("is_deleted").defaultTo(false);

      tbl.index("channel");
    });
}

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.schema.createSchemaIfNotExists(SCHEMA);
    await createUserTable(trx);
    await createChannelTable(trx);
    await createVideosTable(trx);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async (trx: Knex.Transaction) => {
    await trx.schema.withSchema(SCHEMA).dropTableIfExists(TB_VIDEOS);
    await trx.schema.withSchema(SCHEMA).dropTableIfExists(TB_CHANNEL);
    await trx.schema.withSchema(SCHEMA).dropTableIfExists(TB_USER);
  });
}

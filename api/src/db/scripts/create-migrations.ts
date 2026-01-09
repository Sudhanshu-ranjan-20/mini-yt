import fs from "fs";
import path from "path";

const name = process.argv[2];
if (!name) {
  console.error("MIGRATION FILE NAME IS REQUIRED!!");
  process.exit(1);
}

const MIGRATIONS_DIR = path.resolve(__dirname, "../migrations");

if (!fs.existsSync(MIGRATIONS_DIR)) {
  fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "");
const filename = `${timestamp}_${name}.ts`;

const filePath = path.join(MIGRATIONS_DIR, filename);

const template = `import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
}

export async function down(knex: Knex): Promise<void> {
}
`;

fs.writeFileSync(filePath, template);
console.log(`MIGRATION FILE ${name} CREATED AT ${MIGRATIONS_DIR}`);

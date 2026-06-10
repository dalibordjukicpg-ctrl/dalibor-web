import "./load-dotenv";

import { sql } from "drizzle-orm";

import { db } from "../lib/db";

async function addColumn(
  statement: ReturnType<typeof sql>,
  duplicateHint: string,
): Promise<void> {
  try {
    await db.execute(statement);
    console.log(`OK: ${duplicateHint}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Duplicate column") || msg.includes("Duplicate key name")) {
      console.log(`Skip (exists): ${duplicateHint}`);
    } else {
      throw e;
    }
  }
}

async function main() {
  await addColumn(
    sql`ALTER TABLE home_service_cards ADD COLUMN slug varchar(128) NULL AFTER href`,
    "slug column",
  );
  await addColumn(
    sql`CREATE UNIQUE INDEX home_service_cards_slug_unique ON home_service_cards (slug)`,
    "slug unique index",
  );
  await addColumn(
    sql`ALTER TABLE home_service_card_translations ADD COLUMN body text NULL AFTER description`,
    "body column",
  );
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

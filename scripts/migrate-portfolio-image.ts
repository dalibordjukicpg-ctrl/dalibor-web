import "./load-dotenv";

import { sql } from "drizzle-orm";

import { db } from "../lib/db";

async function main() {
  try {
    await db.execute(sql`
      ALTER TABLE home_service_cards
      ADD COLUMN cover_image_url varchar(512) NULL AFTER href
    `);
    console.log("Added cover_image_url column.");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Duplicate column")) {
      console.log("Column cover_image_url already exists.");
    } else {
      throw e;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

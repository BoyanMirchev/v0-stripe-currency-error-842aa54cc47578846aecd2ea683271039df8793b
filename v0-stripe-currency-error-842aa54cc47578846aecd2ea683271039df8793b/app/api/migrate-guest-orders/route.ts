import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  const migrations = [
    `ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_first_name VARCHAR(100)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_last_name VARCHAR(100)`,
  ]

  const results = []

  for (const migration of migrations) {
    try {
      await sql(migration)
      results.push({ status: "OK", query: migration.substring(0, 60) })
    } catch (e: any) {
      results.push({ status: "Error", query: migration.substring(0, 60), error: e.message })
    }
  }

  return NextResponse.json({ message: "Migration complete", results })
}

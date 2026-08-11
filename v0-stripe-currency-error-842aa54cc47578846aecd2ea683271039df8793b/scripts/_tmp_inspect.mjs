import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function main() {
  // Any FK referencing equipment?
  const fks = await sql`
    SELECT tc.table_name AS child, kcu.column_name AS col, rc.delete_rule, tc.constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
    JOIN information_schema.referential_constraints rc
      ON tc.constraint_name = rc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'equipment'`
  console.log("[v0] FKs referencing equipment:", JSON.stringify(fks))

  const idcol = await sql`
    SELECT column_name, data_type FROM information_schema.columns
    WHERE table_name='equipment' AND column_name='id'`
  console.log("[v0] equipment.id column:", JSON.stringify(idcol))

  const sample = await sql`SELECT id FROM equipment ORDER BY id DESC LIMIT 3`
  console.log("[v0] sample ids:", JSON.stringify(sample))
}

main().catch((e) => {
  console.error("[v0] ERR:", e.message)
  process.exit(1)
})

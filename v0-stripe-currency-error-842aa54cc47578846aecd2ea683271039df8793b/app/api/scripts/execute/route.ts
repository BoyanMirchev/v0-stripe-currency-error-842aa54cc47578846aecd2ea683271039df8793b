import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const { scriptName } = await request.json()

    if (!scriptName) {
      return NextResponse.json({ error: "Script name is required" }, { status: 400 })
    }

    const scriptsDir = path.join(process.cwd(), "scripts")
    const scriptPath = path.join(scriptsDir, scriptName)

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 })
    }

    const sqlContent = fs.readFileSync(scriptPath, "utf-8")
    const sql = neon(process.env.DATABASE_URL!)

    // Execute the SQL script using tagged template
    await sql.query(sqlContent, [])

    return NextResponse.json({
      success: true,
      message: `Script ${scriptName} executed successfully`,
    })
  } catch (error: any) {
    console.error("[v0] Error executing script:", error)
    return NextResponse.json(
      {
        error: "Failed to execute script",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

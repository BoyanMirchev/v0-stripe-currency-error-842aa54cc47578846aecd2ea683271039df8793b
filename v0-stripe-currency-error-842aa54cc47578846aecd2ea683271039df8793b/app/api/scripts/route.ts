import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const scriptsDir = path.join(process.cwd(), "scripts")
    const files = fs.readdirSync(scriptsDir)
    const sqlFiles = files.filter((file) => file.endsWith(".sql"))

    const scripts = sqlFiles.map((file) => {
      const filePath = path.join(scriptsDir, file)
      const content = fs.readFileSync(filePath, "utf-8")
      return {
        name: file,
        content,
      }
    })

    return NextResponse.json(scripts)
  } catch (error) {
    console.error("[v0] Error reading scripts:", error)
    return NextResponse.json({ error: "Failed to read scripts" }, { status: 500 })
  }
}

import Link from "next/link"
import { neon } from "@neondatabase/serverless"

export async function SmartphoneUpgradeBanner() {
  let backgroundImage = ""
  let mobileBackgroundImage = ""
  let linkUrl = "/mobile-upgrade"

  try {
    const sql = neon(process.env.DATABASE_URL!)
    const settings = await sql`SELECT * FROM upgrade_banner_settings WHERE is_active = true LIMIT 1`

    if (settings.length > 0) {
      backgroundImage = settings[0].background_image_url || ""
      mobileBackgroundImage = settings[0].mobile_background_image_url || ""
      linkUrl = settings[0].link_url || "/mobile-upgrade"
    }
  } catch (error) {
    console.error("[v0] Error loading upgrade banner settings:", error)
  }

  const desktopBackgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: "linear-gradient(135deg, #7BA4D4 0%, #9BC4E2 50%, #B8D8ED 100%)",
      }

  const mobileBackgroundStyle = mobileBackgroundImage
    ? {
        backgroundImage: `url(${mobileBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : desktopBackgroundStyle

  return (
    <section className="w-full py-8 bg-[#eaebee]">
      <div className="container mx-auto px-4">
        <Link href={linkUrl} className="block">
          <div
            className="md:hidden relative overflow-hidden h-[200px] flex items-center justify-center px-8"
            style={mobileBackgroundStyle}
          >
            <button
              className="px-6 py-2 rounded-full font-semibold text-white transition-all hover:scale-105"
              style={{ backgroundColor: "#2E4A5F" }}
            >
              Виж още
            </button>
          </div>
          <div
            className="hidden md:flex relative overflow-hidden h-[250px] items-center justify-center px-16"
            style={desktopBackgroundStyle}
          >
            <button
              className="px-6 py-2 rounded-full font-semibold text-white transition-all hover:scale-105"
              style={{ backgroundColor: "#2E4A5F" }}
            >
              Виж още
            </button>
          </div>
        </Link>
      </div>
    </section>
  )
}

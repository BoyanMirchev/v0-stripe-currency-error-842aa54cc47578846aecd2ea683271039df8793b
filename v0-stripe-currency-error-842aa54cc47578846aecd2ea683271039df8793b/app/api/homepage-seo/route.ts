import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const result = await sql`SELECT * FROM homepage_seo LIMIT 1`
    
    if (result.length === 0) {
      // Return default SEO settings if none exist
      return NextResponse.json({
        id: 0,
        site_name: "КЕШ",
        title: "КЕШ - Онлайн магазин за електроника, коли и злато",
        description: "КЕШ е водещият онлайн магазин в България за електроника, автомобили и златни бижута.",
        keywords: "КЕШ, електроника, коли, злато, онлайн магазин",
        og_title: null,
        og_description: null,
        og_image: null,
        og_type: "website",
        og_locale: "bg_BG",
        twitter_card: "summary_large_image",
        author: "КЕШ",
        robots: "index, follow",
        theme_color: "#D4AF37",
        logo_url: "/kesh-logo.png",
        logo_alt: "КЕШ Logo",
        logo_width: 110,
        logo_height: 40,
        favicon_url: "/icon.svg",
        apple_touch_icon: "/apple-icon.png"
      })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching homepage SEO:", error)
    return NextResponse.json(
      { error: "Failed to fetch SEO settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    
    // Check if record exists
    const existing = await sql`SELECT id FROM homepage_seo LIMIT 1`
    
    if (existing.length === 0) {
      // Insert new record
      const result = await sql`
        INSERT INTO homepage_seo (
          site_name, title, description, keywords,
          og_title, og_description, og_image, og_image_alt, og_image_width, og_image_height,
          og_type, og_locale, og_site_name, og_url,
          twitter_card, twitter_site, twitter_creator, twitter_title, twitter_description, twitter_image, twitter_image_alt,
          author, robots, googlebot, bingbot, revisit_after, rating, referrer,
          canonical_url, alternate_languages,
          logo_url, logo_alt, logo_width, logo_height,
          favicon_url, apple_touch_icon,
          theme_color, ms_tile_color, background_color,
          google_site_verification, bing_site_verification, yandex_verification, facebook_domain_verification,
          json_ld_organization, json_ld_website, json_ld_local_business, json_ld_breadcrumb,
          enable_google_analytics, google_analytics_id,
          enable_facebook_pixel, facebook_pixel_id,
          enable_google_tag_manager, google_tag_manager_id,
          custom_head_tags,
          updated_at
        ) VALUES (
          ${data.site_name}, ${data.title}, ${data.description}, ${data.keywords},
          ${data.og_title}, ${data.og_description}, ${data.og_image}, ${data.og_image_alt}, ${data.og_image_width || 1200}, ${data.og_image_height || 630},
          ${data.og_type || 'website'}, ${data.og_locale || 'bg_BG'}, ${data.og_site_name}, ${data.og_url},
          ${data.twitter_card || 'summary_large_image'}, ${data.twitter_site}, ${data.twitter_creator}, ${data.twitter_title}, ${data.twitter_description}, ${data.twitter_image}, ${data.twitter_image_alt},
          ${data.author}, ${data.robots || 'index, follow'}, ${data.googlebot}, ${data.bingbot}, ${data.revisit_after}, ${data.rating}, ${data.referrer},
          ${data.canonical_url}, ${data.alternate_languages ? JSON.stringify(data.alternate_languages) : '[]'},
          ${data.logo_url}, ${data.logo_alt}, ${data.logo_width || 110}, ${data.logo_height || 40},
          ${data.favicon_url}, ${data.apple_touch_icon},
          ${data.theme_color}, ${data.ms_tile_color}, ${data.background_color},
          ${data.google_site_verification}, ${data.bing_site_verification}, ${data.yandex_verification}, ${data.facebook_domain_verification},
          ${data.json_ld_organization ? JSON.stringify(data.json_ld_organization) : null}, 
          ${data.json_ld_website ? JSON.stringify(data.json_ld_website) : null}, 
          ${data.json_ld_local_business ? JSON.stringify(data.json_ld_local_business) : null}, 
          ${data.json_ld_breadcrumb ? JSON.stringify(data.json_ld_breadcrumb) : null},
          ${data.enable_google_analytics || false}, ${data.google_analytics_id},
          ${data.enable_facebook_pixel || false}, ${data.facebook_pixel_id},
          ${data.enable_google_tag_manager || false}, ${data.google_tag_manager_id},
          ${data.custom_head_tags},
          CURRENT_TIMESTAMP
        )
        RETURNING *
      `
      return NextResponse.json(result[0])
    } else {
      // Update existing record
      const result = await sql`
        UPDATE homepage_seo SET
          site_name = ${data.site_name},
          title = ${data.title},
          description = ${data.description},
          keywords = ${data.keywords},
          og_title = ${data.og_title},
          og_description = ${data.og_description},
          og_image = ${data.og_image},
          og_image_alt = ${data.og_image_alt},
          og_image_width = ${data.og_image_width || 1200},
          og_image_height = ${data.og_image_height || 630},
          og_type = ${data.og_type || 'website'},
          og_locale = ${data.og_locale || 'bg_BG'},
          og_site_name = ${data.og_site_name},
          og_url = ${data.og_url},
          twitter_card = ${data.twitter_card || 'summary_large_image'},
          twitter_site = ${data.twitter_site},
          twitter_creator = ${data.twitter_creator},
          twitter_title = ${data.twitter_title},
          twitter_description = ${data.twitter_description},
          twitter_image = ${data.twitter_image},
          twitter_image_alt = ${data.twitter_image_alt},
          author = ${data.author},
          robots = ${data.robots || 'index, follow'},
          googlebot = ${data.googlebot},
          bingbot = ${data.bingbot},
          revisit_after = ${data.revisit_after},
          rating = ${data.rating},
          referrer = ${data.referrer},
          canonical_url = ${data.canonical_url},
          alternate_languages = ${data.alternate_languages ? JSON.stringify(data.alternate_languages) : '[]'},
          logo_url = ${data.logo_url},
          logo_alt = ${data.logo_alt},
          logo_width = ${data.logo_width || 110},
          logo_height = ${data.logo_height || 40},
          favicon_url = ${data.favicon_url},
          apple_touch_icon = ${data.apple_touch_icon},
          theme_color = ${data.theme_color},
          ms_tile_color = ${data.ms_tile_color},
          background_color = ${data.background_color},
          google_site_verification = ${data.google_site_verification},
          bing_site_verification = ${data.bing_site_verification},
          yandex_verification = ${data.yandex_verification},
          facebook_domain_verification = ${data.facebook_domain_verification},
          json_ld_organization = ${data.json_ld_organization ? JSON.stringify(data.json_ld_organization) : null},
          json_ld_website = ${data.json_ld_website ? JSON.stringify(data.json_ld_website) : null},
          json_ld_local_business = ${data.json_ld_local_business ? JSON.stringify(data.json_ld_local_business) : null},
          json_ld_breadcrumb = ${data.json_ld_breadcrumb ? JSON.stringify(data.json_ld_breadcrumb) : null},
          enable_google_analytics = ${data.enable_google_analytics || false},
          google_analytics_id = ${data.google_analytics_id},
          enable_facebook_pixel = ${data.enable_facebook_pixel || false},
          facebook_pixel_id = ${data.facebook_pixel_id},
          enable_google_tag_manager = ${data.enable_google_tag_manager || false},
          google_tag_manager_id = ${data.google_tag_manager_id},
          custom_head_tags = ${data.custom_head_tags},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
        RETURNING *
      `
      return NextResponse.json(result[0])
    }
  } catch (error) {
    console.error("Error updating homepage SEO:", error)
    return NextResponse.json(
      { error: "Failed to update SEO settings" },
      { status: 500 }
    )
  }
}

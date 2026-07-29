import type React from "react"
import type { Metadata, Viewport } from "next"
import { Open_Sans } from "next/font/google"
import "./globals.css"

const openSans = Open_Sans({ subsets: ["latin", "cyrillic"], variable: "--font-open-sans" })
import { FloatingActionButton } from "@/components/floating-action-button"
import { Providers } from "@/components/providers"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { neon } from "@neondatabase/serverless"
import { getNavigationCategoryData } from "@/lib/categories"

async function getSeoSettings() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`SELECT * FROM homepage_seo LIMIT 1`
    return result[0] || null
  } catch (error) {
    console.error("[v0] Error fetching SEO settings:", error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings()
  
  // Default values if no SEO settings exist
  const defaults = {
    title: "КЕШ - Онлайн магазин за електроника, коли и злато",
    description: "КЕШ е водещият онлайн магазин в България за електроника, автомобили и златни бижута.",
    siteName: "КЕШ",
  }

  const title = seo?.title || defaults.title
  const description = seo?.description || defaults.description
  const siteName = seo?.site_name || defaults.siteName

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: seo?.keywords || "КЕШ, електроника, коли, злато, онлайн магазин",
    authors: seo?.author ? [{ name: seo.author }] : [{ name: "КЕШ" }],
    creator: seo?.author || "КЕШ",
    publisher: seo?.author || "КЕШ",
    robots: {
      index: seo?.robots?.includes("index") ?? true,
      follow: seo?.robots?.includes("follow") ?? true,
      googleBot: {
        index: seo?.googlebot?.includes("index") ?? true,
        follow: seo?.googlebot?.includes("follow") ?? true,
      },
    },
    alternates: {
      canonical: seo?.canonical_url || undefined,
    },
    openGraph: {
      type: (seo?.og_type as "website" | "article") || "website",
      locale: seo?.og_locale || "bg_BG",
      url: seo?.og_url || undefined,
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      siteName: seo?.og_site_name || siteName,
      images: seo?.og_image
        ? [
            {
              url: seo.og_image,
              width: seo.og_image_width || 1200,
              height: seo.og_image_height || 630,
              alt: seo.og_image_alt || title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: (seo?.twitter_card as "summary" | "summary_large_image") || "summary_large_image",
      site: seo?.twitter_site || undefined,
      creator: seo?.twitter_creator || undefined,
      title: seo?.twitter_title || seo?.og_title || title,
      description: seo?.twitter_description || seo?.og_description || description,
      images: seo?.twitter_image ? [seo.twitter_image] : seo?.og_image ? [seo.og_image] : undefined,
    },
    verification: {
      google: seo?.google_site_verification || undefined,
      yandex: seo?.yandex_verification || undefined,
      other: {
        ...(seo?.bing_site_verification ? { "msvalidate.01": seo.bing_site_verification } : {}),
        ...(seo?.facebook_domain_verification ? { "facebook-domain-verification": seo.facebook_domain_verification } : {}),
      },
    },
    icons: {
      icon: seo?.favicon_url || "/icon.svg",
      apple: seo?.apple_touch_icon || "/apple-icon.png",
    },
    other: {
      ...(seo?.revisit_after ? { "revisit-after": seo.revisit_after } : {}),
      ...(seo?.rating ? { rating: seo.rating } : {}),
    },
  }
}

export async function generateViewport(): Promise<Viewport> {
  const seo = await getSeoSettings()
  
  return {
    themeColor: seo?.theme_color || "#D4AF37",
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const seo = await getSeoSettings()
  const navigationCategories = await getNavigationCategoryData()
  
  return (
    <html lang="bg" className={openSans.variable}>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HCTQMDZVQ4" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HCTQMDZVQ4');
            `,
          }}
        />
        
        {/* JSON-LD Structured Data */}
        {seo?.json_ld_organization && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: typeof seo.json_ld_organization === "string" 
                ? seo.json_ld_organization 
                : JSON.stringify(seo.json_ld_organization),
            }}
          />
        )}
        {seo?.json_ld_website && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: typeof seo.json_ld_website === "string" 
                ? seo.json_ld_website 
                : JSON.stringify(seo.json_ld_website),
            }}
          />
        )}
        {seo?.json_ld_local_business && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: typeof seo.json_ld_local_business === "string" 
                ? seo.json_ld_local_business 
                : JSON.stringify(seo.json_ld_local_business),
            }}
          />
        )}
        
        {/* Google Analytics */}
        {seo?.enable_google_analytics && seo?.google_analytics_id && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${seo.google_analytics_id}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${seo.google_analytics_id}');
                `,
              }}
            />
          </>
        )}
        
        {/* Google Tag Manager */}
        {seo?.enable_google_tag_manager && seo?.google_tag_manager_id && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${seo.google_tag_manager_id}');
              `,
            }}
          />
        )}
        
        {/* Facebook Pixel */}
        {seo?.enable_facebook_pixel && seo?.facebook_pixel_id && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${seo.facebook_pixel_id}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
        
        {/* MS Tile Color */}
        {seo?.ms_tile_color && (
          <meta name="msapplication-TileColor" content={seo.ms_tile_color} />
        )}
        
        {/* Custom Head Tags */}
        {seo?.custom_head_tags && (
          <div dangerouslySetInnerHTML={{ __html: seo.custom_head_tags }} />
        )}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        {seo?.enable_google_tag_manager && seo?.google_tag_manager_id && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${seo.google_tag_manager_id}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        
        {/* Facebook Pixel (noscript) */}
        {seo?.enable_facebook_pixel && seo?.facebook_pixel_id && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${seo.facebook_pixel_id}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
        
        <Providers
          navigationCategories={navigationCategories}
          initialSiteSettings={
            seo
              ? {
                  logo_url: seo.logo_url,
                  logo_alt: seo.logo_alt,
                  logo_width: seo.logo_width,
                  logo_height: seo.logo_height,
                  favicon_url: seo.favicon_url,
                  apple_touch_icon: seo.apple_touch_icon,
                  site_name: seo.site_name,
                }
              : null
          }
        >
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">{children}</main>
          </div>
          <FloatingActionButton />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  )
}

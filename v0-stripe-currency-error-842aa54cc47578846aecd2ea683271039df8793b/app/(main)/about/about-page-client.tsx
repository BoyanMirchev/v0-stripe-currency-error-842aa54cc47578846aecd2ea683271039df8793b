"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useSiteSettings } from "@/contexts/site-settings-context"

interface AboutPageContent {
  hero_subtitle: string
  hero_title: string
  hero_description: string
  hero_first_letter: string
  gold_section_title: string
  gold_section_description: string
  gold_section_highlight: string
  gold_section_image: string
  gold_section_image_caption: string
  gold_section_button_text: string
  gold_section_button_link: string
  electronics_section_title: string
  electronics_section_description: string
  electronics_section_highlight: string
  electronics_section_image: string
  electronics_section_image_caption: string
  electronics_section_button_text: string
  electronics_section_button_link: string
  cars_section_title: string
  cars_section_description: string
  cars_section_highlight: string
  cars_section_image: string
  cars_section_image_caption: string
  cars_section_button_text: string
  cars_section_button_link: string
  timeline_section_title: string
  timeline_events: { year: string; title: string; description: string }[]
  timeline_image: string
  stats_section_title: string
  stats_section_subtitle: string
  stats: { number: string; label: string }[]
  values_section_title: string
  values_section_subtitle: string
  values: { title: string; description: string }[]
  cta_title: string
  cta_subtitle: string
  cta_primary_button_text: string
  cta_primary_button_link: string
  cta_secondary_button_text: string
  cta_secondary_button_link: string
}

interface AboutPageClientProps {
  content: AboutPageContent
}

// Helper function to highlight text
function highlightText(text: string, highlight: string) {
  if (!highlight) return text
  const parts = text.split(highlight)
  if (parts.length === 1) return text
  return (
    <>
      {parts[0]}
      <span className="text-yellow-500">{highlight}</span>
      {parts.slice(1).join(highlight)}
    </>
  )
}

export function AboutPageClient({ content }: AboutPageClientProps) {
  const { settings } = useSiteSettings()
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0)
  const [activeValueIndex, setActiveValueIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValueIndex((prev) => (prev + 1) % content.values.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [content.values.length])

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero Section - Inspired by Tavex */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] text-white overflow-hidden pt-32 lg:pt-24">
        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Kesh Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src={settings.logo_url || "/kesh-logo.png"}
                alt={settings.logo_alt || "КЕШ Logo"}
                width={160}
                height={60}
                className="object-contain"
              />
            </div>
            
            <p className="text-sm tracking-[0.3em] text-yellow-500/80 uppercase">
              {content.hero_subtitle}
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight text-balance text-white/90">
              {content.hero_title}
            </h1>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
                <span className="text-5xl md:text-6xl font-serif text-zinc-500 float-left mr-3 leading-none">{content.hero_first_letter}</span>
                {content.hero_description}
              </p>
            </div>

            {/* Gold bar image area */}
            <div className="pt-12 flex justify-center">
              <div className="relative w-64 h-24 opacity-80">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-sm shadow-2xl transform perspective-1000 rotate-x-12" 
                     style={{ boxShadow: "0 20px 60px rgba(234, 179, 8, 0.3)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Numbered like Tavex */}
      <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-yellow-500/20 to-transparent" style={{ left: "50%" }} />
        
        <div className="container mx-auto px-4">
          {/* Gold Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-24">
            <div className="relative order-2 md:order-1">
              <span className="absolute -left-4 md:-left-20 top-0 text-[200px] font-serif text-zinc-800/30 leading-none select-none">01</span>
              <div className="relative z-10 pl-8 md:pl-0">
                <div className="h-px w-32 bg-yellow-500/50 mb-8" />
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">{content.gold_section_title}</h2>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  {highlightText(content.gold_section_description, content.gold_section_highlight)}
                </p>
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-none"
                  asChild
                >
                  <Link href={content.gold_section_button_link}>{content.gold_section_button_text}</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] order-1 md:order-2">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent z-10" />
              <Image
                src={content.gold_section_image}
                alt={content.gold_section_title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 text-white/70 text-sm">
                {content.gold_section_image_caption}
              </div>
            </div>
          </div>

          {/* Electronics Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-24">
            <div className="relative h-[300px] md:h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0a] via-transparent to-transparent z-10" />
              <Image
                src={content.electronics_section_image}
                alt={content.electronics_section_title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 text-white/70 text-sm">
                {content.electronics_section_image_caption}
              </div>
            </div>
            <div className="relative">
              <span className="absolute -right-4 md:-right-20 top-0 text-[200px] font-serif text-zinc-800/30 leading-none select-none">02</span>
              <div className="relative z-10 pr-8 md:pr-0">
                <div className="h-px w-32 bg-yellow-500/50 mb-8" />
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">{content.electronics_section_title}</h2>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  {highlightText(content.electronics_section_description, content.electronics_section_highlight)}
                </p>
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-none"
                  asChild
                >
                  <Link href={content.electronics_section_button_link}>{content.electronics_section_button_text}</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Cars Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative order-2 md:order-1">
              <span className="absolute -left-4 md:-left-20 top-0 text-[200px] font-serif text-zinc-800/30 leading-none select-none">03</span>
              <div className="relative z-10 pl-8 md:pl-0">
                <div className="h-px w-32 bg-yellow-500/50 mb-8" />
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">{content.cars_section_title}</h2>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  {highlightText(content.cars_section_description, content.cars_section_highlight)}
                </p>
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-none"
                  asChild
                >
                  <Link href={content.cars_section_button_link}>{content.cars_section_button_text}</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] order-1 md:order-2">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent z-10" />
              <Image
                src={content.cars_section_image}
                alt={content.cars_section_title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 text-white/70 text-sm">
                {content.cars_section_image_caption}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section - Inspired by Tavex */}
      <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className="relative h-[400px] md:h-[600px]">
              <Image
                src={content.timeline_image}
                alt="KESH Bulgaria История"
                fill
                className="object-cover grayscale-[30%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]" />
              
              {/* Navigation Arrows */}
              <button 
                onClick={() => setActiveTimelineIndex((prev) => (prev - 1 + content.timeline_events.length) % content.timeline_events.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button 
                onClick={() => setActiveTimelineIndex((prev) => (prev + 1) % content.timeline_events.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Content Side */}
            <div className="text-white space-y-8">
              <h2 className="text-3xl md:text-4xl font-serif">{content.timeline_section_title}</h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                {content.timeline_events[activeTimelineIndex]?.description}
              </p>
              
              {/* Timeline */}
              <div className="pt-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-4">
                  {content.timeline_events.map((event, index) => (
                    <button
                      key={event.year}
                      onClick={() => setActiveTimelineIndex(index)}
                      className="flex flex-col items-center gap-2 min-w-fit"
                    >
                      <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                        index === activeTimelineIndex 
                          ? "border-yellow-500 bg-transparent" 
                          : index < activeTimelineIndex 
                            ? "border-zinc-600 bg-zinc-600" 
                            : "border-zinc-700 bg-transparent"
                      }`} />
                      <span className={`text-sm transition-colors ${
                        index === activeTimelineIndex ? "text-yellow-500 font-semibold" : "text-zinc-500"
                      }`}>
                        {event.year}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="h-px bg-zinc-800 -mt-6 relative z-[-1]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Diamond Cards like Tavex */}
      <section className="py-24 bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#0a0a0a] relative overflow-hidden">
        {/* Purple decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-white tracking-wide">{content.stats_section_title}</h2>
            <p className="text-zinc-400 mt-4">{content.stats_section_subtitle}</p>
          </div>
          
          {/* Diamond Grid */}
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {content.stats.map((stat, index) => (
              <div 
                key={index}
                className="w-40 h-40 md:w-48 md:h-48 bg-[#0a0a0a] rotate-45 flex items-center justify-center shadow-2xl border border-zinc-800/50"
              >
                <div className="-rotate-45 text-center">
                  <div className="text-3xl md:text-4xl font-light text-white mb-2">{stat.number}</div>
                  <div className="text-xs md:text-sm text-zinc-400 max-w-[100px]">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section - Carousel like Tavex */}
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {/* Kesh Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src={settings.logo_url || "/kesh-logo.png"}
                alt={settings.logo_alt || "КЕШ Logo"}
                width={80}
                height={30}
                className="object-contain opacity-70"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">
              {content.values_section_title}
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              {content.values_section_subtitle}
            </p>
          </div>
          
          {/* Values Carousel */}
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              {/* Previous value preview */}
              <div className="hidden lg:block absolute left-0 text-zinc-700/30 text-6xl md:text-8xl font-serif truncate max-w-[200px]">
                {content.values[(activeValueIndex - 1 + content.values.length) % content.values.length]?.title.charAt(0)}
              </div>
              
              {/* Main value */}
              <div className="text-center max-w-3xl mx-auto px-4">
                <h3 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-8 transition-all duration-500">
                  {content.values[activeValueIndex]?.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg max-w-2xl mx-auto transition-all duration-500">
                  {content.values[activeValueIndex]?.description}
                </p>
              </div>
              
              {/* Next value preview */}
              <div className="hidden lg:block absolute right-0 text-zinc-700/30 text-6xl md:text-8xl font-serif truncate max-w-[200px]">
                {content.values[(activeValueIndex + 1) % content.values.length]?.title.substring(0, 3)}
              </div>
            </div>
            
            {/* Value indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {content.values.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveValueIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeValueIndex ? "bg-yellow-500" : "bg-zinc-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/gold-texture.jpg')] opacity-10 mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
              {content.cta_title}
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              {content.cta_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-yellow-600 hover:bg-zinc-100 font-semibold text-lg px-8 rounded-none"
                asChild
              >
                <Link href={content.cta_primary_button_link}>{content.cta_primary_button_text}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-yellow-600 text-lg px-8 bg-transparent rounded-none"
                asChild
              >
                <Link href={content.cta_secondary_button_link}>{content.cta_secondary_button_text}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

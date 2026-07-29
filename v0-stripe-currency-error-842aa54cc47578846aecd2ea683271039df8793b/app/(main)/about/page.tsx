import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { sql } from "@/lib/db"
import { AboutPageClient } from "./about-page-client"

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

// Default content fallback
const defaultContent: AboutPageContent = {
  hero_subtitle: "Злато · Техника · Автомобили",
  hero_title: "Лидер на пазара за злато, техника и автомобили в България",
  hero_description: "ESH Bulgaria е основана през 2008 г. и се е утвърдила като водещ търговец на злато, електроника и автомобили, обслужващ хиляди клиенти годишно.",
  hero_first_letter: "К",
  gold_section_title: "Инвестиционно злато",
  gold_section_description: "Услугите ни включват продажба на златни монети и кюлчета за инвестиционни цели. Сътрудничим си само с най-доказалите се рафинерии в света. Всички златни изделия са със сертификат за автентичност.",
  gold_section_highlight: "златни монети и кюлчета",
  gold_section_image: "/about-gold-bars.jpg",
  gold_section_image_caption: "Купувайте и продавайте злато с KESH",
  gold_section_button_text: "Разгледайте продуктите",
  gold_section_button_link: "/gold",
  electronics_section_title: "Техника и електроника",
  electronics_section_description: "Предлагаме най-новата техника от водещи световни марки. Телевизори, компютри, смартфони и домакински уреди с пълна гаранция и професионална консултация.",
  electronics_section_highlight: "най-новата техника",
  electronics_section_image: "/about-electronics.jpg",
  electronics_section_image_caption: "Техника от водещи марки",
  electronics_section_button_text: "Разгледайте продуктите",
  electronics_section_button_link: "/equipment",
  cars_section_title: "Автомобили",
  cars_section_description: "Селекция от луксозни и практични автомобили за всеки вкус. Всеки автомобил преминава щателна проверка и идва с пълна документация и история.",
  cars_section_highlight: "луксозни и практични автомобили",
  cars_section_image: "/about-luxury-car.jpg",
  cars_section_image_caption: "Автомобили с гаранция",
  cars_section_button_text: "Разгледайте автомобили",
  cars_section_button_link: "/cars",
  timeline_section_title: "Създаването на KESH",
  timeline_events: [
    { year: "2008", title: "Основаване на KESH", description: "Стартиране на KESH Bulgaria с фокус върху злато и електроника" },
    { year: "2012", title: "Разширяване", description: "Добавяне на автомобилна категория и отваряне на втори магазин" },
    { year: "2016", title: "Растеж", description: "Достигане на 5,000+ доволни клиенти" },
    { year: "2019", title: "Иновации", description: "Стартиране на онлайн платформа и доставки в цялата страна" },
    { year: "2022", title: "Лидерство", description: "Утвърждаване като водещ търговец в региона" },
    { year: "2025", title: "Бъдещето", description: "Нови партньорства и разширяване на продуктовата гама" },
  ],
  timeline_image: "/about-store-interior.jpg",
  stats_section_title: "KESH в цифри",
  stats_section_subtitle: "Ключови цифри за нашия бизнес и постижения",
  stats: [
    { number: "3", label: "Категории продукти" },
    { number: "10,000+", label: "Доволни клиенти" },
    { number: "17+", label: "Години опит" },
    { number: "99%", label: "Удовлетвореност" },
    { number: "1000+", label: "Продукти в каталога" },
  ],
  values_section_title: "Вярваме силно в ценностите ни и живеем според тях",
  values_section_subtitle: "Всеки служител, всеки мениджър и всеки клиент споделя тези наши ценности.",
  values: [
    {
      title: "Доверие",
      description: "Доверието е всичко. В нашата сфера на дейност, доверието или развива бизнеса, или го убива. Да бъдем възприемани като надежден партньор за нас означава успех, това е основата на нашата дейност, силата, която ни кара да вървим напред. За да повишим доверието в нас, ние винаги предлагаме качествени продукти, безупречно обслужване, безпристрастни съвети и сигурен и удобен начин да закупите злато, техника и автомобили на най-добрите пазарни цени.",
    },
    {
      title: "Интегритет",
      description: "Действаме честно и етично във всичко, което правим. Спазваме обещанията си и се държим отговорно към нашите клиенти, партньори и общество. Интегритетът е в основата на всяко наше решение.",
    },
    {
      title: "Партньорство",
      description: "Вярваме, че най-добрите резултати идват от силни партньорства. Работим заедно с нашите клиенти, за да разберем техните нужди и да предложим решения, които надхвърлят очакванията им.",
    },
  ],
  cta_title: "Готови ли сте да откриете перфектния продукт?",
  cta_subtitle: "Нашият екип е на разположение да ви помогне да направите най-доброто решение",
  cta_primary_button_text: "Свържете се с нас",
  cta_primary_button_link: "/contact",
  cta_secondary_button_text: "Разгледайте каталога",
  cta_secondary_button_link: "/",
}

async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    const result = await sql`
      SELECT * FROM about_page_content WHERE id = 1
    `
    
    if (result.length === 0) {
      return defaultContent
    }
    
    return result[0] as AboutPageContent
  } catch (error) {
    console.error("Error fetching about page content:", error)
    return defaultContent
  }
}

export default async function AboutPage() {
  const content = await getAboutPageContent()

  return <AboutPageClient content={content} />
}

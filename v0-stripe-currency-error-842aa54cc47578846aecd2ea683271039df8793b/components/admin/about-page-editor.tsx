"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Save, Building2 } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface TimelineEvent {
  year: string
  title: string
  description: string
}

interface Stat {
  number: string
  label: string
}

interface Value {
  title: string
  description: string
}

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
  timeline_events: TimelineEvent[]
  timeline_image: string
  stats_section_title: string
  stats_section_subtitle: string
  stats: Stat[]
  values_section_title: string
  values_section_subtitle: string
  values: Value[]
  cta_title: string
  cta_subtitle: string
  cta_primary_button_text: string
  cta_primary_button_link: string
  cta_secondary_button_text: string
  cta_secondary_button_link: string
}

const defaultContent: AboutPageContent = {
  hero_subtitle: "Злато · Техника · Автомобили",
  hero_title: "Лидер на пазара за злато, техника и автомобили в България",
  hero_description: "ESH Bulgaria е основана през 2008 г. и се е утвърдила като водещ търговец на злато, електроника и автомобили, обслужващ хиляди клиенти годишно.",
  hero_first_letter: "К",
  gold_section_title: "Инвестиционно злато",
  gold_section_description: "Услугите ни включват продажба на златни монети и кюлчета за инвестиционни цели.",
  gold_section_highlight: "златни монети и кюлчета",
  gold_section_image: "/about-gold-bars.jpg",
  gold_section_image_caption: "Купувайте и продавайте злато с KESH",
  gold_section_button_text: "Разгледайте продуктите",
  gold_section_button_link: "/gold",
  electronics_section_title: "Техника и електроника",
  electronics_section_description: "Предлагаме най-новата техника от водещи световни марки.",
  electronics_section_highlight: "най-новата техника",
  electronics_section_image: "/about-electronics.jpg",
  electronics_section_image_caption: "Техника от водещи марки",
  electronics_section_button_text: "Разгледайте продуктите",
  electronics_section_button_link: "/equipment",
  cars_section_title: "Автомобили",
  cars_section_description: "Селекция от луксозни и практични автомобили за всеки вкус.",
  cars_section_highlight: "луксозни и практични автомобили",
  cars_section_image: "/about-luxury-car.jpg",
  cars_section_image_caption: "Автомобили с гаранция",
  cars_section_button_text: "Разгледайте автомобили",
  cars_section_button_link: "/cars",
  timeline_section_title: "Създаването на KESH",
  timeline_events: [
    { year: "2008", title: "Основаване на KESH", description: "Стартиране на KESH Bulgaria" },
  ],
  timeline_image: "/about-store-interior.jpg",
  stats_section_title: "KESH в цифри",
  stats_section_subtitle: "Ключови цифри за нашия бизнес и постижения",
  stats: [
    { number: "3", label: "Категории продукти" },
  ],
  values_section_title: "Вярваме силно в ценностите ни и живеем според тях",
  values_section_subtitle: "Всеки служител, всеки мениджър и всеки клиент споделя тези наши ценности.",
  values: [
    { title: "Доверие", description: "Доверието е всичко." },
  ],
  cta_title: "Готови ли сте да откриете перфектния продукт?",
  cta_subtitle: "Нашият екип е на разположение да ви помогне да направите най-доброто решение",
  cta_primary_button_text: "Свържете се с нас",
  cta_primary_button_link: "/contact",
  cta_secondary_button_text: "Разгледайте каталога",
  cta_secondary_button_link: "/",
}

export function AboutPageEditor() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<AboutPageContent>(defaultContent)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/about-content")
      if (response.ok) {
        const data = await response.json()
        setContent({
          ...data,
          timeline_events: data.timeline_events || defaultContent.timeline_events,
          stats: data.stats || defaultContent.stats,
          values: data.values || defaultContent.values,
        })
      }
    } catch (error) {
      console.error("Error fetching about page content:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на съдържанието",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/about-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      if (response.ok) {
        toast({
          title: "Успех",
          description: "Съдържанието е запазено успешно",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving about page content:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на съдържанието",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof AboutPageContent, value: any) => {
    setContent((prev) => ({ ...prev, [field]: value }))
  }

  const addTimelineEvent = () => {
    setContent((prev) => ({
      ...prev,
      timeline_events: [...prev.timeline_events, { year: "", title: "", description: "" }],
    }))
  }

  const removeTimelineEvent = (index: number) => {
    setContent((prev) => ({
      ...prev,
      timeline_events: prev.timeline_events.filter((_, i) => i !== index),
    }))
  }

  const updateTimelineEvent = (index: number, field: keyof TimelineEvent, value: string) => {
    setContent((prev) => ({
      ...prev,
      timeline_events: prev.timeline_events.map((event, i) =>
        i === index ? { ...event, [field]: value } : event
      ),
    }))
  }

  const addStat = () => {
    setContent((prev) => ({
      ...prev,
      stats: [...prev.stats, { number: "", label: "" }],
    }))
  }

  const removeStat = (index: number) => {
    setContent((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }))
  }

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    setContent((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) =>
        i === index ? { ...stat, [field]: value } : stat
      ),
    }))
  }

  const addValue = () => {
    setContent((prev) => ({
      ...prev,
      values: [...prev.values, { title: "", description: "" }],
    }))
  }

  const removeValue = (index: number) => {
    setContent((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }))
  }

  const updateValue = (index: number, field: keyof Value, value: string) => {
    setContent((prev) => ({
      ...prev,
      values: prev.values.map((val, i) =>
        i === index ? { ...val, [field]: value } : val
      ),
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Зареждане...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Редактиране на страница &quot;Компанията&quot;
        </CardTitle>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Запазване..." : "Запази промените"}
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["hero"]} className="space-y-4">
          {/* Hero Section */}
          <AccordionItem value="hero" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold">
              Hero секция
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Подзаглавие</Label>
                  <Input
                    value={content.hero_subtitle}
                    onChange={(e) => updateField("hero_subtitle", e.target.value)}
                    placeholder="Злато · Техника · Автомобили"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Първа буква (голяма)</Label>
                  <Input
                    value={content.hero_first_letter}
                    onChange={(e) => updateField("hero_first_letter", e.target.value)}
                    maxLength={1}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Заглавие</Label>
                <Input
                  value={content.hero_title}
                  onChange={(e) => updateField("hero_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={content.hero_description}
                  onChange={(e) => updateField("hero_description", e.target.value)}
                  rows={3}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Gold Section */}
          <AccordionItem value="gold" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold">
              Секция Злато (01)
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Заглавие</Label>
                <Input
                  value={content.gold_section_title}
                  onChange={(e) => updateField("gold_section_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={content.gold_section_description}
                  onChange={(e) => updateField("gold_section_description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Текст за подчертаване (жълт)</Label>
                <Input
                  value={content.gold_section_highlight}
                  onChange={(e) => updateField("gold_section_highlight", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL на снимка</Label>
                  <Input
                    value={content.gold_section_image}
                    onChange={(e) => updateField("gold_section_image", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Надпис на снимката</Label>
                  <Input
                    value={content.gold_section_image_caption}
                    onChange={(e) => updateField("gold_section_image_caption", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Текст на бутон</Label>
                  <Input
                    value={content.gold_section_button_text}
                    onChange={(e) => updateField("gold_section_button_text", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Линк на бутон</Label>
                  <Input
                    value={content.gold_section_button_link}
                    onChange={(e) => updateField("gold_section_button_link", e.target.value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Electronics Section */}
          <AccordionItem value="electronics" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold">
              Секция Техника (02)
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Заглавие</Label>
                <Input
                  value={content.electronics_section_title}
                  onChange={(e) => updateField("electronics_section_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={content.electronics_section_description}
                  onChange={(e) => updateField("electronics_section_description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Текст за подчертаване (жълт)</Label>
                <Input
                  value={content.electronics_section_highlight}
                  onChange={(e) => updateField("electronics_section_highlight", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL на снимка</Label>
                  <Input
                    value={content.electronics_section_image}
                    onChange={(e) => updateField("electronics_section_image", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Надпис на снимката</Label>
                  <Input
                    value={content.electronics_section_image_caption}
                    onChange={(e) => updateField("electronics_section_image_caption", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Текст на бутон</Label>
                  <Input
                    value={content.electronics_section_button_text}
                    onChange={(e) => updateField("electronics_section_button_text", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Линк на бутон</Label>
                  <Input
                    value={content.electronics_section_button_link}
                    onChange={(e) => updateField("electronics_section_button_link", e.target.value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Cars Section */}
          <AccordionItem value="cars" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold">
              Секция Автомобили (03)
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Заглавие</Label>
                <Input
                  value={content.cars_section_title}
                  onChange={(e) => updateField("cars_section_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={content.cars_section_description}
                  onChange={(e) => updateField("cars_section_description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Текст за подчертаване (жълт)</Label>
                <Input
                  value={content.cars_section_highlight}
                  onChange={(e) => updateField("cars_section_highlight", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL на снимка</Label>
                  <Input
                    value={content.cars_section_image}
                    onChange={(e) => updateField("cars_section_image", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Надпис на снимката</Label>
                  <Input
                    value={content.cars_section_image_caption}
                    onChange={(e) => updateField("cars_section_image_caption", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Текст на бутон</Label>
                  <Input
                    value={content.cars_section_button_text}
                    onChange={(e) => updateField("cars_section_button_text", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Линк на бутон</Label>
                  <Input
                    value={content.cars_section_button_link}
                    onChange={(e) => updateField("cars_section_button_link", e.target.value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Timeline Section */}
          <AccordionItem value="timeline" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold">
              Хронология
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Заглавие на секцията</Label>
                  <Input
                    value={content.timeline_section_title}
                    onChange={(e) => updateField("timeline_section_title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL на снимка</Label>
                  <Input
                    value={content.timeline_image}
                    onChange={(e) => updateField("timeline_image", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Събития</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addTimelineEvent}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добави събитие
                  </Button>
                </div>
                {content.timeline_events.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-muted-foreground">Събитие {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimelineEvent(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Година</Label>
                        <Input
                          value={event.year}
                          onChange={(e) => updateTimelineEvent(index, "year", e.target.value)}
                          placeholder="2008"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Заглавие</Label>
                        <Input
                          value={event.title}
                          onChange={(e) => updateTimelineEvent(index, "title", e.target.value)}
                          placeholder="Основаване на KESH"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Описание</Label>
                        <Input
                          value={event.description}
                          onChange={(e) => updateTimelineEvent(index, "description", e.target.value)}
                          placeholder="Стартиране на KESH Bulgaria"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Stats Section */}
          <AccordionItem value="stats" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold">
              Статистики
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Заглавие на секцията</Label>
                  <Input
                    value={content.stats_section_title}
                    onChange={(e) => updateField("stats_section_title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Подзаглавие</Label>
                  <Input
                    value={content.stats_section_subtitle}
                    onChange={(e) => updateField("stats_section_subtitle", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Статистики</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addStat}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добави статистика
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {content.stats.map((stat, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-muted-foreground">Статистика {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStat(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Число</Label>
                        <Input
                          value={stat.number}
                          onChange={(e) => updateStat(index, "number", e.target.value)}
                          placeholder="10,000+"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Етикет</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => updateStat(index, "label", e.target.value)}
                          placeholder="Доволни клиенти"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Values Section */}
          <AccordionItem value="values" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold">
              Ценности
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Заглавие на секцията</Label>
                  <Input
                    value={content.values_section_title}
                    onChange={(e) => updateField("values_section_title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Подзаглавие</Label>
                  <Input
                    value={content.values_section_subtitle}
                    onChange={(e) => updateField("values_section_subtitle", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Ценности</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addValue}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добави ценност
                  </Button>
                </div>
                {content.values.map((value, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-muted-foreground">Ценност {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeValue(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Заглавие</Label>
                      <Input
                        value={value.title}
                        onChange={(e) => updateValue(index, "title", e.target.value)}
                        placeholder="Доверие"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Описание</Label>
                      <Textarea
                        value={value.description}
                        onChange={(e) => updateValue(index, "description", e.target.value)}
                        placeholder="Описание на ценността..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* CTA Section */}
          <AccordionItem value="cta" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold">
              Call to Action секция
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Заглавие</Label>
                <Input
                  value={content.cta_title}
                  onChange={(e) => updateField("cta_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Подзаглавие</Label>
                <Textarea
                  value={content.cta_subtitle}
                  onChange={(e) => updateField("cta_subtitle", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Текст на основен бутон</Label>
                  <Input
                    value={content.cta_primary_button_text}
                    onChange={(e) => updateField("cta_primary_button_text", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Линк на основен бутон</Label>
                  <Input
                    value={content.cta_primary_button_link}
                    onChange={(e) => updateField("cta_primary_button_link", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Текст на вторичен бутон</Label>
                  <Input
                    value={content.cta_secondary_button_text}
                    onChange={(e) => updateField("cta_secondary_button_text", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Линк на вторичен бутон</Label>
                  <Input
                    value={content.cta_secondary_button_link}
                    onChange={(e) => updateField("cta_secondary_button_link", e.target.value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

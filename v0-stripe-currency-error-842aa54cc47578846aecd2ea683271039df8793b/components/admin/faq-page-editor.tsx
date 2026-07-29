"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Save, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Question {
  q: string
  a: string
}

interface FAQCategory {
  category: string
  icon: string
  questions: Question[]
}

interface FAQContent {
  hero_title: string
  hero_description: string
  search_placeholder: string
  contact_title: string
  contact_subtitle: string
  contact_button_text: string
  contact_button_link: string
  contact_phone: string
  faq_categories: FAQCategory[]
}

const defaultContent: FAQContent = {
  hero_title: "Често задавани въпроси",
  hero_description: "Намерете отговори на най-често задаваните въпроси от нашите клиенти",
  search_placeholder: "Търсене в въпросите...",
  contact_title: "Не намерихте отговор?",
  contact_subtitle: "Свържете се с нашия екип за поддръжка",
  contact_button_text: "Свържете се с нас",
  contact_button_link: "/contact",
  contact_phone: "0700 123 456",
  faq_categories: [],
}

const iconOptions = ["🚚", "💳", "↩️", "👤", "📦", "🔧", "📞", "✨", "🎁", "🛡️", "⏰", "💰"]

export function FAQPageEditor() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<FAQContent>(defaultContent)
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/faq-content")
      if (response.ok) {
        const data = await response.json()
        setContent({
          ...data,
          faq_categories: data.faq_categories || [],
        })
      }
    } catch (error) {
      console.error("Error fetching FAQ content:", error)
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
      const response = await fetch("/api/faq-content", {
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
      console.error("Error saving FAQ content:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на съдържанието",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof FAQContent, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCategory = (index: number) => {
    setExpandedCategories((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  // Category operations
  const addCategory = () => {
    setContent((prev) => ({
      ...prev,
      faq_categories: [
        ...prev.faq_categories,
        { category: "Нова категория", icon: "📦", questions: [] },
      ],
    }))
    setExpandedCategories((prev) => [...prev, content.faq_categories.length])
  }

  const removeCategory = (index: number) => {
    setContent((prev) => ({
      ...prev,
      faq_categories: prev.faq_categories.filter((_, i) => i !== index),
    }))
    setExpandedCategories((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)))
  }

  const updateCategory = (index: number, field: keyof FAQCategory, value: string) => {
    setContent((prev) => ({
      ...prev,
      faq_categories: prev.faq_categories.map((cat, i) =>
        i === index ? { ...cat, [field]: value } : cat
      ),
    }))
  }

  const moveCategoryUp = (index: number) => {
    if (index === 0) return
    setContent((prev) => {
      const newCategories = [...prev.faq_categories]
      ;[newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]]
      return { ...prev, faq_categories: newCategories }
    })
  }

  const moveCategoryDown = (index: number) => {
    if (index === content.faq_categories.length - 1) return
    setContent((prev) => {
      const newCategories = [...prev.faq_categories]
      ;[newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]]
      return { ...prev, faq_categories: newCategories }
    })
  }

  // Question operations
  const addQuestion = (categoryIndex: number) => {
    setContent((prev) => ({
      ...prev,
      faq_categories: prev.faq_categories.map((cat, i) =>
        i === categoryIndex
          ? { ...cat, questions: [...cat.questions, { q: "", a: "" }] }
          : cat
      ),
    }))
  }

  const removeQuestion = (categoryIndex: number, questionIndex: number) => {
    setContent((prev) => ({
      ...prev,
      faq_categories: prev.faq_categories.map((cat, i) =>
        i === categoryIndex
          ? { ...cat, questions: cat.questions.filter((_, qi) => qi !== questionIndex) }
          : cat
      ),
    }))
  }

  const updateQuestion = (
    categoryIndex: number,
    questionIndex: number,
    field: keyof Question,
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      faq_categories: prev.faq_categories.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              questions: cat.questions.map((q, qi) =>
                qi === questionIndex ? { ...q, [field]: value } : q
              ),
            }
          : cat
      ),
    }))
  }

  const moveQuestionUp = (categoryIndex: number, questionIndex: number) => {
    if (questionIndex === 0) return
    setContent((prev) => ({
      ...prev,
      faq_categories: prev.faq_categories.map((cat, i) => {
        if (i !== categoryIndex) return cat
        const newQuestions = [...cat.questions]
        ;[newQuestions[questionIndex - 1], newQuestions[questionIndex]] = [
          newQuestions[questionIndex],
          newQuestions[questionIndex - 1],
        ]
        return { ...cat, questions: newQuestions }
      }),
    }))
  }

  const moveQuestionDown = (categoryIndex: number, questionIndex: number) => {
    const category = content.faq_categories[categoryIndex]
    if (questionIndex === category.questions.length - 1) return
    setContent((prev) => ({
      ...prev,
      faq_categories: prev.faq_categories.map((cat, i) => {
        if (i !== categoryIndex) return cat
        const newQuestions = [...cat.questions]
        ;[newQuestions[questionIndex], newQuestions[questionIndex + 1]] = [
          newQuestions[questionIndex + 1],
          newQuestions[questionIndex],
        ]
        return { ...cat, questions: newQuestions }
      }),
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
          <HelpCircle className="w-6 h-6" />
          Редактиране на страница &quot;Често задавани въпроси&quot;
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
              <div className="space-y-2">
                <Label>Заглавие</Label>
                <Input
                  value={content.hero_title}
                  onChange={(e) => updateField("hero_title", e.target.value)}
                  placeholder="Често задавани въпроси"
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={content.hero_description}
                  onChange={(e) => updateField("hero_description", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Placeholder за търсене</Label>
                <Input
                  value={content.search_placeholder}
                  onChange={(e) => updateField("search_placeholder", e.target.value)}
                  placeholder="Търсене в въпросите..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Contact Section */}
          <AccordionItem value="contact" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold">
              Секция &quot;Свържете се с нас&quot;
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Заглавие</Label>
                <Input
                  value={content.contact_title}
                  onChange={(e) => updateField("contact_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Подзаглавие</Label>
                <Input
                  value={content.contact_subtitle}
                  onChange={(e) => updateField("contact_subtitle", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Текст на бутон</Label>
                  <Input
                    value={content.contact_button_text}
                    onChange={(e) => updateField("contact_button_text", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Линк на бутон</Label>
                  <Input
                    value={content.contact_button_link}
                    onChange={(e) => updateField("contact_button_link", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input
                  value={content.contact_phone}
                  onChange={(e) => updateField("contact_phone", e.target.value)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* FAQ Categories */}
          <AccordionItem value="categories" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold">
              Категории и въпроси ({content.faq_categories.length})
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <Button onClick={addCategory} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Добави категория
              </Button>

              <div className="space-y-4">
                {content.faq_categories.map((category, catIndex) => (
                  <div
                    key={catIndex}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                      onClick={() => toggleCategory(catIndex)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="font-semibold">{category.category}</span>
                        <span className="text-sm text-gray-500">
                          ({category.questions.length} въпроса)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveCategoryUp(catIndex)
                          }}
                          disabled={catIndex === 0}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveCategoryDown(catIndex)
                          }}
                          disabled={catIndex === content.faq_categories.length - 1}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeCategory(catIndex)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {expandedCategories.includes(catIndex) && (
                      <div className="p-4 space-y-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Име на категория</Label>
                            <Input
                              value={category.category}
                              onChange={(e) =>
                                updateCategory(catIndex, "category", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Икона</Label>
                            <div className="flex flex-wrap gap-2">
                              {iconOptions.map((icon) => (
                                <button
                                  key={icon}
                                  type="button"
                                  onClick={() => updateCategory(catIndex, "icon", icon)}
                                  className={`p-2 text-xl rounded border ${
                                    category.icon === icon
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  {icon}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Въпроси</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addQuestion(catIndex)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Добави въпрос
                            </Button>
                          </div>

                          {category.questions.map((question, qIndex) => (
                            <div
                              key={qIndex}
                              className="p-4 bg-gray-50 rounded-lg space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                  Въпрос #{qIndex + 1}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveQuestionUp(catIndex, qIndex)}
                                    disabled={qIndex === 0}
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveQuestionDown(catIndex, qIndex)}
                                    disabled={qIndex === category.questions.length - 1}
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeQuestion(catIndex, qIndex)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Въпрос</Label>
                                <Input
                                  value={question.q}
                                  onChange={(e) =>
                                    updateQuestion(catIndex, qIndex, "q", e.target.value)
                                  }
                                  placeholder="Въведете въпрос..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Отговор</Label>
                                <Textarea
                                  value={question.a}
                                  onChange={(e) =>
                                    updateQuestion(catIndex, qIndex, "a", e.target.value)
                                  }
                                  placeholder="Въведете отговор..."
                                  rows={3}
                                />
                              </div>
                            </div>
                          ))}

                          {category.questions.length === 0 && (
                            <p className="text-center text-gray-500 py-4">
                              Няма добавени въпроси. Натиснете &quot;Добави въпрос&quot; за да добавите.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {content.faq_categories.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Няма добавени категории. Натиснете &quot;Добави категория&quot; за да започнете.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

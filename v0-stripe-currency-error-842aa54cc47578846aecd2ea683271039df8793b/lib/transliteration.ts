const latinToCyrillicMap: Record<string, string> = {
  a: "а",
  b: "б",
  v: "в",
  g: "г",
  d: "д",
  e: "е",
  zh: "ж",
  z: "з",
  i: "и",
  y: "й",
  j: "й",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  f: "ф",
  h: "х",
  c: "ц",
  ch: "ч",
  sh: "ш",
  sht: "щ",
  sch: "щ",
  "''": "ъ",
  y: "ы",
  "'": "ь",
  yu: "ю",
  ya: "я",
}

const cyrillicToLatinMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "c",
  ч: "ch",
  ш: "sh",
  щ: "sht",
  ъ: "a",
  ь: "",
  ю: "yu",
  я: "ya",
}

export function latinToCyrillic(text: string): string {
  let result = text.toLowerCase()

  // Replace multi-character combinations first
  const multiChar = ["sht", "sch", "zh", "ch", "sh", "yu", "ya", "''"]
  for (const combo of multiChar) {
    const regex = new RegExp(combo, "g")
    result = result.replace(regex, latinToCyrillicMap[combo] || combo)
  }

  // Replace single characters
  result = result
    .split("")
    .map((char) => latinToCyrillicMap[char] || char)
    .join("")

  return result
}

export function cyrillicToLatin(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((char) => cyrillicToLatinMap[char] || char)
    .join("")
}

export function generateSearchVariants(query: string): string[] {
  const normalized = query.toLowerCase().trim()
  const variants = new Set<string>()

  // Add original
  variants.add(normalized)

  // Check if query contains Latin characters
  const hasLatin = /[a-z]/i.test(normalized)
  // Check if query contains Cyrillic characters
  const hasCyrillic = /[а-яА-Я]/i.test(normalized)

  if (hasLatin) {
    // If Latin, add Cyrillic variant
    variants.add(latinToCyrillic(normalized))
  }

  if (hasCyrillic) {
    // If Cyrillic, add Latin variant
    variants.add(cyrillicToLatin(normalized))
  }

  return Array.from(variants)
}

export interface Product {
  id: number
  slug: string
  type?: "gold" | "equipment" | "car"
  promoTag?: string
  promoTagColor?: string
  image: string
  images?: string[]
  brochureTag?: boolean
  name: string
  price: string
  oldPrice?: string
  promotion?: number
  description: string
  features: string[]
  specifications: { key: string; value: string }[]
}

const products: Product[] = [
  {
    id: 1,
    slug: "motorola-edge-60-pro",
    type: "equipment",
    image: "/products/motorola-g54.webp",
    images: [
      "/products/motorola-g54.webp",
      "/placeholder.svg?width=400&height=400&text=Side",
      "/placeholder.svg?width=400&height=400&text=Back",
    ],
    brochureTag: true,
    name: 'Смартфон GSM MOTOROLA EDGE 60 PRO Green 6.67 ", 512 GB, RAM 12 GB',
    price: "999.99",
    description:
      "Открийте ново измерение на скоростта и мощността със смартфона Motorola Edge 60 Pro. Снабден с огромен 512 GB вградена памет и 12 GB RAM, този телефон е създаден за максимална производителност. Насладете се на невероятно живи цветове и детайли на 6.67-инчовия дисплей.",
    features: [
      '6.67" P-OLED дисплей с HDR10+',
      "512 GB вградена памет",
      "12 GB RAM",
      "Процесор Snapdragon® 8 Gen 2",
      "50MP основна камера",
    ],
    specifications: [
      { key: "Дисплей", value: '6.67" P-OLED, 165Hz, HDR10+' },
      { key: "Процесор", value: "Qualcomm Snapdragon® 8 Gen 2" },
      { key: "Памет", value: "512 GB" },
      { key: "RAM", value: "12 GB" },
      { key: "Камера", value: "50MP + 50MP + 12MP" },
      { key: "Батерия", value: "4600 mAh" },
    ],
  },
  {
    id: 2,
    slug: "sony-bravia-k-65xr8m2",
    type: "equipment",
    promoTag: "НОВО",
    promoTagColor: "bg-green-500",
    image: "/products/sony-bravia-tv.webp",
    images: ["/products/sony-bravia-tv.webp"],
    brochureTag: true,
    name: "Телевизор SONY BRAVIA 8 II K-65XR8M2 4K Ultra HD OLED",
    price: "5499.00",
    description:
      "Потопете се в света на реалистичните изображения със Sony Bravia 8. Този 4K Ultra HD OLED телевизор предлага несравним контраст, цветове и детайли, благодарение на най-новите технологии на Sony. Смарт функциите и елегантният дизайн го правят център на всяко домашно забавление.",
    features: [
      "65-инчов 4K Ultra HD OLED екран",
      "Cognitive Processor XR™",
      "Acoustic Surface Audio+™",
      "Google TV с гласов контрол",
      "Идеален за PlayStation® 5",
    ],
    specifications: [
      { key: "Размер на екрана", value: '65" (164 см)' },
      { key: "Резолюция", value: "3840 x 2160 4K Ultra HD" },
      { key: "Тип панел", value: "OLED" },
      { key: "Смарт платформа", value: "Google TV" },
      { key: "Звук", value: "Acoustic Surface Audio+™" },
    ],
  },
  {
    id: 3,
    slug: "beko-rdso-206",
    type: "equipment",
    image: "/products/lg-refrigerator.jpeg",
    images: ["/products/lg-refrigerator.jpeg"],
    brochureTag: true,
    name: "Хладилник с горен фризер BEKO RDSO 206 K40WN 143.00 см",
    price: "429.99",
    description:
      "Ефективен и компактен, хладилникът Beko RDSO 206 е идеалното решение за по-малки кухни. С височина 143 см, той предлага оптимално разпределение на пространството и надеждно охлаждане, за да запази продуктите ви свежи за по-дълго.",
    features: [
      "Общ обем: 206 литра",
      "Енергиен клас F",
      "Статична система за охлаждане",
      "LED осветление",
      "Стъклени рафтове",
    ],
    specifications: [
      { key: "Общ обем", value: "206 л" },
      { key: "Обем на хладилна част", value: "169 л" },
      { key: "Обем на фризерна част", value: "37 л" },
      { key: "Енергиен клас", value: "F" },
      { key: "Размери (В/Ш/Д)", value: "143 / 54 / 57.4 см" },
    ],
  },
  {
    id: 4,
    slug: "sencor-sim3000bk",
    type: "equipment",
    image: "/products/sencor-ice-maker.jpeg",
    images: ["/products/sencor-ice-maker.jpeg"],
    brochureTag: true,
    name: "ЛЕДОГЕНЕРАТОР SENCOR SIM3000BK ЧЕРЕН",
    price: "279.00",
    description:
      "Никога повече не оставайте без лед с ледогенератора Sencor SIM3000BK. Компактен и бърз, той може да произведе до 12 кг лед за 24 часа, което го прави идеален за партита, събирания или ежедневна употреба.",
    features: [
      "Произвежда до 12 кг лед на ден",
      "Два размера на кубчетата лед",
      "Индикатори за пълен контейнер и липса на вода",
      "Компактен и преносим дизайн",
    ],
    specifications: [
      { key: "Капацитет", value: "12 кг/24 часа" },
      { key: "Обем на резервоара за вода", value: "1.9 л" },
      { key: "Мощност", value: "105 W" },
      { key: "Цвят", value: "Черен" },
    ],
  },
  {
    id: 5,
    slug: "playstation-portal",
    type: "equipment",
    image: "/products/playstation-portal.jpeg",
    images: ["/products/playstation-portal.jpeg"],
    brochureTag: true,
    name: "PLAYSTATION PORTAL REMOTE PLAYER MIDNIGHT BLACK",
    price: "439.00",
    description:
      "Играйте на вашата PS5® конзола през домашната Wi-Fi мрежа с контроли с качеството на конзола, като използвате PlayStation Portal™ Remote Player. Насладете се на невероятните функции на безжичния контролер DualSense®, като хаптична обратна връзка и адаптивни спусъци.",
    features: [
      '8" LCD екран с резолюция 1080p при 60fps',
      "Характеристики на DualSense® контролер",
      "Свързва се с вашата PS5 чрез Wi-Fi",
      "3.5 мм аудио жак за слушалки",
    ],
    specifications: [
      { key: "Дисплей", value: '8" LCD, 1080p, 60Hz' },
      { key: "Свързаност", value: "Wi-Fi" },
      { key: "Съвместимост", value: "PlayStation® 5" },
      { key: "Аудио", value: "3.5 мм жак" },
    ],
  },
  {
    id: 6,
    slug: "lenovo-loq-15irx9",
    type: "equipment",
    image: "/products/lenovo-loq-laptop.jpeg",
    images: ["/products/lenovo-loq-laptop.jpeg"],
    brochureTag: true,
    name: 'Гейминг лаптоп LENOVO LOQ 15IRX9 83DV00HWBM 15.6 ", INTEL CORE I5-12450HX, 16 GB, 1 TB SSD, NVIDIA GEFORCE RTX 3050',
    price: "2399.00",
    description:
      "Влезте в света на гейминга с Lenovo LOQ 15IRX9. Този лаптоп е оборудван с мощен процесор Intel Core i5, бърза NVIDIA GeForce RTX 3050 видеокарта и 1 TB SSD, за да ви осигури плавно и завладяващо гейминг изживяване.",
    features: [
      '15.6" Full HD дисплей със 144Hz опресняване',
      "Процесор Intel Core i5-12450HX",
      "NVIDIA GeForce RTX 3050 6GB",
      "1 TB NVMe SSD",
      "16 GB DDR5 RAM",
    ],
    specifications: [
      { key: "Процесор", value: "Intel Core i5-12450HX" },
      { key: "Видеокарта", value: "NVIDIA GeForce RTX 3050 6GB GDDR6" },
      { key: "RAM", value: "16 GB DDR5 4800MHz" },
      { key: "Диск", value: "1 TB SSD M.2 NVMe" },
      { key: "Дисплей", value: '15.6" (39.62 см) Full HD, 144Hz, IPS' },
    ],
  },
]

export function getProducts(): Product[] {
  return products
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

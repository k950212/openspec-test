export type ProductVariantSelection = Record<string, string>

export type ProductVariantOptionGroup = {
  id: string
  label: string
  values: string[]
}

export type ProductVariantCombination = {
  id: string
  selections: ProductVariantSelection
}

export type ProductVariants = {
  optionGroups: ProductVariantOptionGroup[]
  combinations: ProductVariantCombination[]
}

export type Product = {
  id: number
  name: string
  price: number
  category: string
  description: string
  image: string
  variants?: ProductVariants
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Aster 輕量越野跑鞋',
    price: 84,
    category: '鞋履',
    description: '輕量越野跑鞋，鞋面柔軟透氣，抓地力穩定，適合通勤與日常長時間步行。',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    variants: {
      optionGroups: [
        { id: 'color', label: '顏色', values: ['琥珀黃', '石墨灰'] },
        { id: 'size', label: '尺寸', values: ['38', '39', '40', '41'] },
      ],
      combinations: [
        { id: 'amber-38', selections: { color: '琥珀黃', size: '38' } },
        { id: 'amber-39', selections: { color: '琥珀黃', size: '39' } },
        { id: 'amber-40', selections: { color: '琥珀黃', size: '40' } },
        { id: 'graphite-39', selections: { color: '石墨灰', size: '39' } },
        { id: 'graphite-40', selections: { color: '石墨灰', size: '40' } },
        { id: 'graphite-41', selections: { color: '石墨灰', size: '41' } },
      ],
    },
  },
  {
    id: 2,
    name: 'Canvas 綜合烘焙咖啡豆',
    price: 36,
    category: '咖啡',
    description: '帶有柑橘香氣與柔和尾韻的綜合豆，適合手沖與晨間慢節奏沖煮時光。',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    variants: {
      optionGroups: [
        { id: 'roast', label: '烘焙度', values: ['淺焙', '中焙'] },
        { id: 'size', label: '包裝', values: ['250克', '500克'] },
      ],
      combinations: [
        { id: 'light-250', selections: { roast: '淺焙', size: '250克' } },
        { id: 'light-500', selections: { roast: '淺焙', size: '500克' } },
        { id: 'medium-250', selections: { roast: '中焙', size: '250克' } },
      ],
    },
  },
  {
    id: 3,
    name: 'Harbor 圓角邊桌',
    price: 62,
    category: '家具',
    description: '圓角邊桌外型溫潤，適合放在沙發旁或床邊，兼顧展示與隨手置物需求。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    variants: {
      optionGroups: [
        { id: 'finish', label: '表面材質', values: ['橡木色', '胡桃木色'] },
        { id: 'size', label: '尺寸', values: ['小型', '大型'] },
      ],
      combinations: [
        { id: 'oak-small', selections: { finish: '橡木色', size: '小型' } },
        { id: 'oak-large', selections: { finish: '橡木色', size: '大型' } },
        { id: 'walnut-large', selections: { finish: '胡桃木色', size: '大型' } },
      ],
    },
  },
  {
    id: 4,
    name: 'Cipher 機械式鍵盤',
    price: 58,
    category: '桌面設備',
    description: '緊湊鍵位與穩定手感兼具的機械式鍵盤，適合長時間打字與桌面創作使用。',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Luma 陶瓷花器',
    price: 28,
    category: '家飾',
    description: '霧面陶瓷花器線條柔和，適合搭配乾燥花或綠色枝葉，為空間增添溫度。',
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Drift 寬鬆短袖上衣',
    price: 72,
    category: '服飾',
    description: '寬鬆版型與柔軟布料帶來舒適垂墜感，適合四季日常穿搭與層次搭配。',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    name: 'Studio 旅行手提袋',
    price: 24,
    category: '旅行',
    description: '輕便手提袋容量剛好，適合短住旅行、健身裝備收納與週末外出使用。',
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    name: 'Orbit 桌燈',
    price: 41,
    category: '燈具',
    description: '聚焦型桌燈提供溫暖光線與簡潔外型，適合閱讀、書寫與深夜工作時使用。',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 9,
    name: 'Contour 疊放馬克杯組',
    price: 67,
    category: '咖啡',
    description: '可堆疊馬克杯節省廚房空間，也讓日常喝咖啡的桌面視覺更整齊有序。',
    image:
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 10,
    name: 'Field 質感披毯',
    price: 79,
    category: '家飾',
    description: '具層次感的織紋披毯能為沙發與床鋪添上暖意，也適合閱讀時隨手披蓋。',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 11,
    name: 'Arc 多用途圓凳',
    price: 22,
    category: '家具',
    description: '小巧圓凳可作為臨時座位、植栽架或床邊小平台，使用情境非常靈活。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 12,
    name: 'Moss 布面筆記本',
    price: 31,
    category: '文具',
    description: '布面筆記本搭配滑順紙張，適合記錄行程、整理靈感與日常書寫。',
    image:
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 13,
    name: 'North 輕量外套',
    price: 65,
    category: '服飾',
    description: '適合多變天氣的輕量外套，剪裁俐落、穿著輕盈，是日常外出的實用單品。',
    image:
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 14,
    name: 'Fold 閱讀椅',
    price: 54,
    category: '家具',
    description: '佔地不大的閱讀椅兼具放鬆坐感與包覆性，適合打造安靜角落。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 15,
    name: 'Echo 包耳式耳機',
    price: 93,
    category: '音訊',
    description: '包耳式耳機著重沉浸聆聽與長時間佩戴舒適度，適合專注工作與創作。',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 16,
    name: 'Brew 手沖電子秤',
    price: 47,
    category: '咖啡',
    description: '纖薄電子秤幫助穩定控制手沖比例與節奏，讓每一杯咖啡更容易重現。',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 17,
    name: 'Ridge 保溫水瓶',
    price: 39,
    category: '生活',
    description: '不鏽鋼保溫水瓶握感俐落、保溫穩定，適合工作、健走與日常外出攜帶。',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 18,
    name: 'Dawn 香氛蠟燭',
    price: 29,
    category: '家飾',
    description: '雪松與柑橘香調蠟燭，能為居家清晨與夜晚帶來安靜、舒緩的氛圍。',
    image:
      'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 19,
    name: 'Sora 亞麻靠枕',
    price: 26,
    category: '家飾',
    description: '亞麻材質靠枕以自然皺褶與柔和色調，提升沙發與床鋪的日常舒適感。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 20,
    name: 'Vale 木質托盤',
    price: 33,
    category: '家飾',
    description: '木質托盤適合擺放咖啡杯、香氛與小物，能讓桌面收納更整潔有層次。',
    image:
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 21,
    name: 'Pine 雙人沙發',
    price: 120,
    category: '家具',
    description: '雙人沙發以柔和線條與中性布面材質打造，適合小宅客廳與閱讀角落。',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 22,
    name: 'Cove 收納斗櫃',
    price: 98,
    category: '家具',
    description: '收納斗櫃抽屜容量充足，外型簡潔，適合整理衣物、文具與居家雜物。',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 23,
    name: 'Mira 羊毛圍巾',
    price: 38,
    category: '服飾',
    description: '羊毛圍巾手感柔軟保暖，色調低飽和，適合秋冬通勤與層次穿搭。',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 24,
    name: 'Loom 直筒長褲',
    price: 44,
    category: '服飾',
    description: '直筒長褲線條俐落，布料挺度適中，適合日常上班與休閒穿搭切換。',
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 25,
    name: 'Tide 皮革涼鞋',
    price: 52,
    category: '鞋履',
    description: '皮革涼鞋以俐落線條與穩定鞋底設計，適合夏日散步與城市外出穿著。',
    image:
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 26,
    name: 'Glade 帆布便鞋',
    price: 48,
    category: '鞋履',
    description: '帆布便鞋輕盈好搭配，適合日常通勤、週末散步與旅行輕裝穿著。',
    image:
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 27,
    name: 'Halo 掛燈',
    price: 64,
    category: '燈具',
    description: '吊掛燈具散發柔和暖光，適合餐桌、工作區與閱讀角落的集中照明。',
    image:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 28,
    name: 'Noma 床頭燈',
    price: 35,
    category: '燈具',
    description: '床頭燈外型簡潔，亮度溫和，適合夜間閱讀與睡前放鬆情境使用。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 29,
    name: 'Bloom 手沖壺',
    price: 42,
    category: '咖啡',
    description: '細口手沖壺能更穩定控制注水速度與方向，是居家咖啡角落的重要工具。',
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 30,
    name: 'Grain 密封豆罐',
    price: 19,
    category: '咖啡',
    description: '密封豆罐能延長咖啡豆新鮮度，也讓廚房檯面看起來更整齊一致。',
    image:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 31,
    name: 'Trace 藍牙音箱',
    price: 68,
    category: '音訊',
    description: '藍牙音箱體積小巧但聲音飽滿，適合居家播放背景音樂與工作陪伴。',
    image:
      'https://images.unsplash.com/photo-1512446816042-444d64126727?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 32,
    name: 'Pulse 黑膠唱片架',
    price: 57,
    category: '音訊',
    description: '黑膠唱片架兼具展示與收納功能，適合將收藏整齊陳列於居家角落。',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 33,
    name: 'Roam 登機後背包',
    price: 59,
    category: '旅行',
    description: '後背包內層分隔清楚，適合短程旅行、登機隨身與日常通勤攜帶。',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 34,
    name: 'Path 行李收納袋組',
    price: 27,
    category: '旅行',
    description: '收納袋組讓衣物、配件與盥洗用品更容易分門別類，整理旅行箱更有效率。',
    image:
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 35,
    name: 'Note 黃銅尺',
    price: 18,
    category: '文具',
    description: '黃銅尺外型細緻、手感紮實，適合桌面書寫、紙本工作與細節排版使用。',
    image:
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 36,
    name: 'Script 墨水筆',
    price: 25,
    category: '文具',
    description: '墨水筆書寫滑順，適合日常筆記、手寫卡片與長篇紀錄時保持穩定手感。',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
  },
]

export function findProductById(productId: number) {
  return products.find((product) => product.id === productId)
}

export function parseProductId(value: string | string[] | undefined) {
  if (value === undefined) {
    return null
  }

  const candidate = Array.isArray(value) ? value[0] : value
  const parsedValue = Number(candidate)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return null
  }

  return parsedValue
}

export function hasProductVariants(product: Product) {
  return (product.variants?.optionGroups.length ?? 0) > 0
}

export function normalizeVariantSelection(selection: ProductVariantSelection) {
  return Object.fromEntries(
    Object.entries(selection)
      .filter((entry): entry is [string, string] => entry[1].trim().length > 0)
      .sort(([left], [right]) => left.localeCompare(right)),
  )
}

export function serializeVariantSelection(selection: ProductVariantSelection) {
  return JSON.stringify(normalizeVariantSelection(selection))
}

export function isProductVariantSelectionComplete(
  product: Product,
  selection: ProductVariantSelection,
) {
  if (!hasProductVariants(product)) {
    return true
  }

  return product.variants!.optionGroups.every((group) => {
    const selectedValue = selection[group.id]
    return typeof selectedValue === 'string' && selectedValue.length > 0
  })
}

export function findMatchingVariantCombination(
  product: Product,
  selection: ProductVariantSelection,
) {
  if (!hasProductVariants(product)) {
    return null
  }

  const normalizedSelection = normalizeVariantSelection(selection)

  return (
    product.variants!.combinations.find(
      (combination) =>
        serializeVariantSelection(combination.selections) ===
        serializeVariantSelection(normalizedSelection),
    ) ?? null
  )
}

export function isVariantValueAvailable(
  product: Product,
  optionGroupId: string,
  optionValue: string,
  selection: ProductVariantSelection,
) {
  if (!hasProductVariants(product)) {
    return true
  }

  return product.variants!.combinations.some((combination) => {
    if (combination.selections[optionGroupId] !== optionValue) {
      return false
    }

    return Object.entries(selection).every(([groupId, selectedValue]) => {
      if (groupId === optionGroupId || selectedValue.trim().length === 0) {
        return true
      }

      return combination.selections[groupId] === selectedValue
    })
  })
}

export function getProductVariantSelectionSummary(
  product: Product,
  selection: ProductVariantSelection,
) {
  if (!hasProductVariants(product)) {
    return []
  }

  return product.variants!.optionGroups.flatMap((group) => {
    const selectedValue = selection[group.id]

    if (!selectedValue) {
      return []
    }

    return [`${group.label}: ${selectedValue}`]
  })
}

export function getRelatedProducts(productId: number, limit = 4) {
  const currentProduct = findProductById(productId)

  if (!currentProduct || limit <= 0) {
    return [] as Product[]
  }

  return products
    .filter((product) => product.id !== currentProduct.id)
    .filter((product) => product.category === currentProduct.category)
    .slice(0, limit)
}

export type Product = {
  id: number
  name: string
  price: number
  category: string
  description: string
  image: string
}

export const products: Product[] = [
  {
    id: 1,
    name: '輕盈慢跑運動鞋',
    price: 84,
    category: '鞋類',
    description:
      '採用透氣網布與柔軟緩震鞋底，適合日常通勤、散步與輕度運動穿著。',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: '晨光中焙咖啡豆',
    price: 36,
    category: '廚房',
    description:
      '中焙風味溫潤順口，帶有淡淡可可香氣，適合手沖與日常美式沖煮。',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: '橡木休閒單人椅',
    price: 62,
    category: '居家',
    description:
      '天然木質椅架搭配舒適坐墊，適合擺放在客廳角落或閱讀空間。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: '極簡機械式鍵盤',
    price: 58,
    category: '桌面',
    description:
      '緊湊版面搭配明確段落手感，適合工作、打字與打造整潔桌面環境。',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: '帆布旅行週末包',
    price: 28,
    category: '旅行',
    description:
      '大容量收納空間搭配耐用提把設計，短途旅行與健身外出都很實用。',
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: '經典純棉素色上衣',
    price: 72,
    category: '服飾',
    description:
      '厚實純棉材質與寬鬆版型，單穿或內搭都能呈現簡潔俐落的日常風格。',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    name: '大理石紋保溫水壺',
    price: 24,
    category: '配件',
    description:
      '雙層保溫結構可長時間保冷保溫，外觀低調有質感，適合每日攜帶。',
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    name: '工作室桌燈',
    price: 41,
    category: '桌面',
    description:
      '可調整燈頭角度與柔和暖光，適合夜間閱讀、工作與桌面氣氛照明。',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 9,
    name: '霧面陶瓷餐盤組',
    price: 67,
    category: '廚房',
    description:
      '包含餐盤與湯碗的日常組合，霧面質地沉穩耐看，提升用餐儀式感。',
    image:
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 10,
    name: '戶外機能後背包',
    price: 79,
    category: '旅行',
    description:
      '具備多層收納與舒適背負設計，適合通勤、短途出遊與戶外活動使用。',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 11,
    name: '亞麻抱枕',
    price: 22,
    category: '居家',
    description:
      '亞麻布料自然柔和，能為沙發、床鋪或窗邊角落增添溫暖層次。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 12,
    name: '皮革卡片夾',
    price: 31,
    category: '配件',
    description:
      '輕薄好攜帶，可收納常用卡片與少量紙鈔，適合簡約日常外出使用。',
    image:
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 13,
    name: '海岸針織毛衣',
    price: 65,
    category: '服飾',
    description:
      '柔軟針織與寬鬆輪廓穿起來舒適自然，適合秋冬日常與層次穿搭。',
    image:
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 14,
    name: '北歐風邊桌',
    price: 54,
    category: '居家',
    description:
      '簡約線條與小巧尺寸，不論放在沙發旁、床邊或閱讀角都很合適。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 15,
    name: '無線降噪耳機',
    price: 93,
    category: '科技',
    description:
      '具備主動降噪與清晰音質，適合通勤、工作專注與長時間音樂聆聽。',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 16,
    name: '陶瓷手沖咖啡組',
    price: 47,
    category: '廚房',
    description:
      '包含濾杯與分享壺的手沖入門組，外型沉穩，適合喜歡手沖咖啡的人。',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 17,
    name: '防滑瑜珈墊',
    price: 39,
    category: '運動',
    description:
      '高抓地力與適中厚度設計，適合瑜珈伸展、核心訓練與居家運動使用。',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 18,
    name: '極簡靜音掛鐘',
    price: 29,
    category: '居家',
    description:
      '靜音機芯搭配簡潔鐘面設計，能自然融入各種現代居家空間。',
    image:
      'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=80',
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

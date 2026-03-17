export type ProductVariantSelection = Record<string, string>

export type ProductVariantOptionGroup = {
  id: string
  label: string
  values: string[]
}

export type ProductVariantCombination = {
  id: string
  selections: ProductVariantSelection
  gallery?: string[]
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
  gallery?: string[]
  variants?: ProductVariants
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Aster 城市跑鞋',
    price: 84,
    category: '鞋履',
    description: '適合日常通勤與輕量步行的低筒跑鞋，鞋面透氣、輪廓俐落。',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=80',
    ],
    variants: {
      optionGroups: [
        { id: 'color', label: '顏色', values: ['琥珀棕', '石墨灰'] },
        { id: 'size', label: '尺寸', values: ['38', '39', '40', '41'] },
      ],
      combinations: [
        {
          id: 'amber-38',
          selections: { color: '琥珀棕', size: '38' },
          gallery: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
          ],
        },
        {
          id: 'amber-39',
          selections: { color: '琥珀棕', size: '39' },
          gallery: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
          ],
        },
        {
          id: 'amber-40',
          selections: { color: '琥珀棕', size: '40' },
          gallery: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
          ],
        },
        {
          id: 'graphite-39',
          selections: { color: '石墨灰', size: '39' },
          gallery: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80&sat=-100',
            'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80',
          ],
        },
        {
          id: 'graphite-40',
          selections: { color: '石墨灰', size: '40' },
          gallery: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80&sat=-100',
            'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80',
          ],
        },
        {
          id: 'graphite-41',
          selections: { color: '石墨灰', size: '41' },
          gallery: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80&sat=-100',
            'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80',
          ],
        },
      ],
    },
  },
  {
    id: 2,
    name: 'Canvas 手沖咖啡豆',
    price: 36,
    category: '咖啡',
    description: '為手沖與濾杯沖煮設計的日常配豆，帶有柔和果香與乾淨尾韻。',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',
    ],
    variants: {
      optionGroups: [
        { id: 'roast', label: '烘焙度', values: ['淺焙', '中焙'] },
        { id: 'size', label: '包裝', values: ['250g', '500g'] },
      ],
      combinations: [
        {
          id: 'light-250',
          selections: { roast: '淺焙', size: '250g' },
          gallery: [
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
          ],
        },
        {
          id: 'light-500',
          selections: { roast: '淺焙', size: '500g' },
          gallery: [
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
          ],
        },
        {
          id: 'medium-250',
          selections: { roast: '中焙', size: '250g' },
          gallery: [
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80&sat=-20',
            'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
          ],
        },
      ],
    },
  },
  {
    id: 3,
    name: 'Harbor 木質邊桌',
    price: 62,
    category: '家具',
    description: '比例輕巧的木質邊桌，適合放在沙發旁或床邊作為日常收納。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80&sat=-10',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
    ],
    variants: {
      optionGroups: [
        { id: 'finish', label: '表面材質', values: ['淺橡木', '深胡桃'] },
        { id: 'size', label: '尺寸', values: ['小型', '大型'] },
      ],
      combinations: [
        {
          id: 'oak-small',
          selections: { finish: '淺橡木', size: '小型' },
          gallery: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
          ],
        },
        {
          id: 'oak-large',
          selections: { finish: '淺橡木', size: '大型' },
          gallery: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
          ],
        },
        {
          id: 'walnut-large',
          selections: { finish: '深胡桃', size: '大型' },
          gallery: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80&sat=-40',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80&hue=20',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80&sat=-25',
          ],
        },
      ],
    },
  },
  {
    id: 4,
    name: 'Cipher 桌面鍵盤',
    price: 58,
    category: '桌面設備',
    description: '窄邊框與低調配色的日常鍵盤，適合書桌與工作空間搭配。',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 5,
    name: 'Luma 玻璃花器',
    price: 28,
    category: '家飾',
    description: '霧面質地花器，適合單枝花材或乾燥花擺設。',
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 6,
    name: 'Drift 針織上衣',
    price: 72,
    category: '服飾',
    description: '柔軟厚度適中的針織上衣，適合季節交替時搭配。',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 7,
    name: 'Studio 皮革筆記本',
    price: 24,
    category: '文具',
    description: '內頁留白比例舒適，適合工作規劃與隨手記錄。',
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 8,
    name: 'Orbit 黃銅吊燈',
    price: 41,
    category: '燈具',
    description: '圓潤燈罩搭配溫暖光色，適合餐桌與玄關照明。',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80&hue=20',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80&hue=20',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80&sat=-20',
    ],
  },
  {
    id: 9,
    name: 'Contour 咖啡禮盒',
    price: 67,
    category: '咖啡',
    description: '適合作為送禮的咖啡組，包含多款風味搭配。',
    image:
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 10,
    name: 'Field 亞麻抱枕',
    price: 79,
    category: '家飾',
    description: '自然色系亞麻抱枕，讓沙發與床邊看起來更有層次。',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 11,
    name: 'Arc 木質圓凳',
    price: 22,
    category: '家具',
    description: '尺寸輕巧的小圓凳，可作為床邊、玄關或臨時座位使用。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80&hue=10',
  },
  {
    id: 12,
    name: 'Moss 編織收納籃',
    price: 31,
    category: '生活',
    description: '方便整理衣物與雜物的編織收納籃，搬動也很輕鬆。',
    image:
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 13,
    name: 'North 連帽外套',
    price: 65,
    category: '服飾',
    description: '簡潔廓形的連帽外套，適合出門層次穿搭。',
    image:
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 14,
    name: 'Fold 餐廳長桌',
    price: 54,
    category: '家具',
    description: '適合小坪數空間的木質長桌，擺在餐廳或工作區都很合適。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80&crop=faces',
  },
  {
    id: 15,
    name: 'Echo 無線耳機',
    price: 93,
    category: '音訊',
    description: '封閉式耳罩搭配柔軟耳墊，適合工作與沉浸式聆聽。',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 16,
    name: 'Brew 玻璃咖啡壺',
    price: 47,
    category: '咖啡',
    description: '清透壺身搭配俐落手柄，適合日常手沖與分享。',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80&crop=entropy',
  },
  {
    id: 17,
    name: 'Ridge 行李吊牌',
    price: 39,
    category: '旅行',
    description: '讓行李更容易辨識的皮革吊牌，細節乾淨、攜帶方便。',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 18,
    name: 'Dawn 床邊檯燈',
    price: 29,
    category: '燈具',
    description: '小巧燈體搭配暖白光源，適合閱讀與夜間照明。',
    image:
      'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 19,
    name: 'Sora 木質托盤',
    price: 26,
    category: '家飾',
    description: '低邊緣木盤適合放茶具、香氛或桌面小物。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80&crop=entropy',
  },
  {
    id: 20,
    name: 'Vale 香氛蠟燭',
    price: 33,
    category: '生活',
    description: '溫和木質調香氣，適合為居家空間增加安定氛圍。',
    image:
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 21,
    name: 'Pine 三人沙發',
    price: 120,
    category: '家具',
    description: '寬坐面與柔和線條兼具，適合客廳作為核心家具。',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80&crop=entropy',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 22,
    name: 'Cove 休閒扶手椅',
    price: 98,
    category: '家具',
    description: '包覆感舒適的休閒椅，適合閱讀角落與窗邊。',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80&hue=15',
  },
  {
    id: 23,
    name: 'Mira 絲巾',
    price: 38,
    category: '服飾',
    description: '輕薄材質適合繫在頸間、包袋或頭髮上做造型點綴。',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 24,
    name: 'Loom 披肩',
    price: 44,
    category: '服飾',
    description: '大地色系披肩，適合作為外出防風或室內保暖搭配。',
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 25,
    name: 'Tide 帆布鞋',
    price: 52,
    category: '鞋履',
    description: '百搭帆布鞋型，適合日常散步與輕鬆穿搭。',
    image:
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 26,
    name: 'Glade 皮革涼鞋',
    price: 48,
    category: '鞋履',
    description: '柔軟鞋面與穩定鞋底，適合夏季日常穿著。',
    image:
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 27,
    name: 'Halo 金屬吊燈',
    price: 64,
    category: '燈具',
    description: '俐落金屬線條與集中光源，適合餐桌上方照明。',
    image:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80&hue=30',
  },
  {
    id: 28,
    name: 'Noma 桌燈',
    price: 35,
    category: '燈具',
    description: '可作為工作桌與床頭燈使用，亮度柔和不刺眼。',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80&hue=40',
  },
  {
    id: 29,
    name: 'Bloom 咖啡濾杯',
    price: 42,
    category: '咖啡',
    description: '讓水流更穩定的濾杯輪廓，適合日常手沖練習。',
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 30,
    name: 'Grain 手作咖啡杯',
    price: 19,
    category: '咖啡',
    description: '杯型手感紮實，適合早晨咖啡或下午茶時光。',
    image:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 31,
    name: 'Trace 黑膠唱片',
    price: 68,
    category: '音訊',
    description: '封面設計與音色氛圍都很耐看的收藏型黑膠。',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 32,
    name: 'Pulse 桌上喇叭',
    price: 57,
    category: '音訊',
    description: '適合工作桌與書房使用的小型喇叭，聲音均衡清楚。',
    image:
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 33,
    name: 'Roam 旅行後背包',
    price: 59,
    category: '旅行',
    description: '容量與分層配置兼具，適合短途出門與城市移動。',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 34,
    name: 'Path 旅行收納包',
    price: 27,
    category: '旅行',
    description: '讓線材、文件與隨身用品更容易整理的旅行收納包。',
    image:
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 35,
    name: 'Note 線裝筆記本',
    price: 18,
    category: '文具',
    description: '封面手感溫潤，適合用來寫草稿、旅行記錄與讀書摘要。',
    image:
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 36,
    name: 'Script 鋼筆',
    price: 25,
    category: '文具',
    description: '握感穩定、筆尖滑順，適合長時間書寫與日常簽記。',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80&hue=5',
    ],
  },
]

function uniqueImages(images: string[]) {
  const seen = new Set<string>()

  return images.filter((image) => {
    if (typeof image !== 'string') {
      return false
    }

    const normalized = image.trim()

    if (normalized.length === 0 || seen.has(normalized)) {
      return false
    }

    seen.add(normalized)
    return true
  })
}

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

export function getBaseProductGallery(product: Product) {
  return uniqueImages([product.image, ...(product.gallery ?? [])])
}

export function getProductGallery(product: Product, selection: ProductVariantSelection = {}) {
  const matchingVariantGallery = findMatchingVariantCombination(product, selection)?.gallery ?? []

  if (matchingVariantGallery.length > 0) {
    return uniqueImages(matchingVariantGallery)
  }

  return getBaseProductGallery(product)
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

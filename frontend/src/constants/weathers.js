export const WEATHERS = [
  { emoji: '☀️', label: '맑음', mood: '활기차고 에너지 넘치는' },
  { emoji: '🌤️', label: '구름조금', mood: '평온하고 여유로운' },
  { emoji: '⛅', label: '흐림', mood: '잔잔하고 보통인' },
  { emoji: '🌦️', label: '가끔비', mood: '복잡하고 다사다난한' },
  { emoji: '🌧️', label: '비', mood: '감성적이고 촉촉한' },
  { emoji: '⛈️', label: '폭풍', mood: '격렬하고 격동적인' },
  { emoji: '🌩️', label: '번개', mood: '예측불가하고 짜릿한' },
  { emoji: '🌨️', label: '눈', mood: '포근하고 설레는' },
  { emoji: '❄️', label: '한파', mood: '차갑고 고요한' },
  { emoji: '🌫️', label: '안개', mood: '몽롱하고 꿈같은' },
  { emoji: '🌈', label: '무지개', mood: '희망차고 다채로운' },
  { emoji: '🌙', label: '밤', mood: '고요하고 사색적인' },
]

export function mapOwmCode(code) {
  if (code >= 200 && code < 300) return WEATHERS.findIndex(w => w.label === '폭풍')
  if (code >= 300 && code < 400) return WEATHERS.findIndex(w => w.label === '비')
  if (code >= 500 && code < 511) return WEATHERS.findIndex(w => w.label === '비')
  if (code === 511 || (code >= 600 && code < 700)) return WEATHERS.findIndex(w => w.label === '눈')
  if (code >= 700 && code < 800) return WEATHERS.findIndex(w => w.label === '안개')
  if (code === 800) return WEATHERS.findIndex(w => w.label === '맑음')
  if (code === 801) return WEATHERS.findIndex(w => w.label === '구름조금')
  if (code >= 802 && code <= 804) return WEATHERS.findIndex(w => w.label === '흐림')
  return 0
}

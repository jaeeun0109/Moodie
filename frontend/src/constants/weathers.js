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

const findWeatherIndex = (label) => {
  const index = WEATHERS.findIndex((weather) => weather.label === label)
  return index === -1 ? 0 : index
}

export function mapKmaWeather(sky, pty, temp) {
  const hour = new Date().getHours()
  const isNight = hour >= 19 || hour < 6

  if (isNight && Number(pty) === 0) {
    return findWeatherIndex('밤')
  }

  if (Number(temp) <= -5) {
    return findWeatherIndex('한파')
  }

  switch (Number(pty)) {
    case 1:
      return findWeatherIndex('비')
    case 2:
      return findWeatherIndex('가끔비')
    case 3:
      return findWeatherIndex('눈')
    case 4:
      return findWeatherIndex('가끔비')
    case 5:
      return findWeatherIndex('가끔비')
    case 6:
      return findWeatherIndex('가끔비')
    case 7:
      return findWeatherIndex('눈')
    default:
      break
  }

  switch (Number(sky)) {
    case 1:
      return findWeatherIndex('맑음')
    case 3:
      return findWeatherIndex('구름조금')
    case 4:
      return findWeatherIndex('흐림')
    default:
      return findWeatherIndex('맑음')
  }
}
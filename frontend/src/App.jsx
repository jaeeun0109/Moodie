import { useState, useEffect, useCallback } from 'react'
import { WEATHERS, mapKmaWeather } from './constants/weathers'
import WriteSection from './components/WriteSection'
import FeedSection from './components/FeedSection'
import CalendarSection from './components/CalendarSection'
import SettingsModal from './components/SettingsModal'
import './App.css'

const TABS = [
  { key: 'write', label: '✍️ 쓰기' },
  { key: 'feed', label: '📖 피드' },
  { key: 'calendar', label: '📅 달력' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('write')
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem('diaryEntries') || '[]'))
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('weatherApiKey') || '')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toast, setToast] = useState({ msg: '', show: false })
  const [weatherLocation, setWeatherLocation] = useState('📍 위치 로딩 중...')

  const [selectedWeather, setSelectedWeather] = useState(null)
  const [diaryText, setDiaryText] = useState('')
  const [currentTags, setCurrentTags] = useState([])

  const dateNow = new Date()
  const [calYear, setCalYear] = useState(dateNow.getFullYear())
  const [calMonth, setCalMonth] = useState(dateNow.getMonth())

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(entries))
  }, [entries])

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2200)
  }, [])

  const fetchWeather = useCallback(async (key) => {
  if (!key) {
    setWeatherLocation('⚙️ 공공데이터 API 키 미설정')
    return
  }

  // 대전/한밭대 근처 기상청 격자 좌표
  const nx = 67
  const ny = 100

  // 단기예보 발표시간: 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300
  const getBaseDateTime = () => {
    const now = new Date()
    const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23]

    let baseHour = baseTimes
      .filter((time) => now.getHours() >= time)
      .pop()

    if (baseHour === undefined) {
      now.setDate(now.getDate() - 1)
      baseHour = 23
    }

    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')

    return {
      baseDate: `${yyyy}${mm}${dd}`,
      baseTime: `${String(baseHour).padStart(2, '0')}00`,
    }
  }

  try {
    const { baseDate, baseTime } = getBaseDateTime()

    const url =
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst` +
      `?serviceKey=${key}` +
      `&pageNo=1` +
      `&numOfRows=1000` +
      `&dataType=JSON` +
      `&base_date=${baseDate}` +
      `&base_time=${baseTime}` +
      `&nx=${nx}` +
      `&ny=${ny}`

    const res = await fetch(url)
    const data = await res.json()

    console.log('기상청 API 응답:', data)

    if (data.response?.header?.resultCode !== '00') {
      setWeatherLocation('⚠️ API 응답 오류')
      return
    }

    const items = data.response.body.items.item

    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const todayDate = `${yyyy}${mm}${dd}`

    const nowHour = String(today.getHours()).padStart(2, '0')
    const targetTime = `${nowHour}00`

    const tempItem =
      items.find(item => item.category === 'TMP' && item.fcstDate === todayDate && item.fcstTime === targetTime) ||
      items.find(item => item.category === 'TMP')

    const rainItem =
      items.find(item => item.category === 'PTY' && item.fcstDate === todayDate && item.fcstTime === targetTime) ||
      items.find(item => item.category === 'PTY')

    const skyItem =
      items.find(item => item.category === 'SKY' && item.fcstDate === todayDate && item.fcstTime === targetTime) ||
      items.find(item => item.category === 'SKY')

    const temp = tempItem ? Number(tempItem.fcstValue) : 0
    const pty = rainItem ? Number(rainItem.fcstValue) : 0
    const sky = skyItem ? Number(skyItem.fcstValue) : 1

    const weatherIndex = mapKmaWeather(sky, pty, temp)

    setWeatherLocation(`📍 대전 ${Math.round(temp)}°C`)
    setSelectedWeather(prev => prev === null ? weatherIndex : prev)
  } catch (error) {
    console.error(error)
    setWeatherLocation('⚠️ 기상청 날씨 오류')
  }
}, [])

  useEffect(() => {
    fetchWeather(apiKey)
  }, [apiKey, fetchWeather])

  const saveEntry = () => {
    if (!diaryText.trim()) {
      showToast('일기 내용을 입력해주세요 ✏️')
      return
    }

    if (selectedWeather === null) {
      showToast('날씨를 선택해주세요 🌤️')
      return
    }

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      weather: WEATHERS[selectedWeather],
      text: diaryText.trim(),
      tags: [...currentTags],
    }

    setEntries(prev => [entry, ...prev])
    setDiaryText('')
    setSelectedWeather(null)
    setCurrentTags([])
    showToast('기록되었어요 ✨')
  }

  const deleteEntry = (id) => {
    if (!confirm('이 기록을 삭제할까요?')) return
    setEntries(prev => prev.filter(e => e.id !== id))
    showToast('삭제되었어요')
  }

  const saveSettings = (newKey) => {
    setApiKey(newKey)
    localStorage.setItem('weatherApiKey', newKey)
    setSettingsOpen(false)
    showToast('설정이 저장되었어요')
  }

  return (
    <>
      <header>
        <div className="logo">날씨<span>일기</span></div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setSettingsOpen(true)} title="API 설정">⚙️</button>
          <button className="icon-btn" onClick={() => setDarkMode(d => !d)} title="다크모드">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <nav>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {activeTab === 'write' && (
          <WriteSection
            selectedWeather={selectedWeather}
            setSelectedWeather={setSelectedWeather}
            diaryText={diaryText}
            setDiaryText={setDiaryText}
            currentTags={currentTags}
            setCurrentTags={setCurrentTags}
            weatherLocation={weatherLocation}
            onSave={saveEntry}
          />
        )}

        {activeTab === 'feed' && (
          <FeedSection entries={entries} onDelete={deleteEntry} />
        )}

        {activeTab === 'calendar' && (
          <CalendarSection
            entries={entries}
            onDelete={deleteEntry}
            calYear={calYear}
            calMonth={calMonth}
            setCalYear={setCalYear}
            setCalMonth={setCalMonth}
          />
        )}
      </main>

      {settingsOpen && (
        <SettingsModal apiKey={apiKey} onSave={saveSettings} onClose={() => setSettingsOpen(false)} />
      )}

      <div className={`toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
    </>
  )
}
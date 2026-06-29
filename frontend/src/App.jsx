import { useState, useEffect, useCallback } from 'react'
import { WEATHERS, mapOwmCode } from './constants/weathers'
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

  const now = new Date()
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())

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

  // 일단 대전/한밭대 근처 격자 좌표로 고정
  const nx = 67
  const ny = 100

  const now = new Date()
  now.setMinutes(now.getMinutes() - 40)

  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const baseDate = `${yyyy}${mm}${dd}`

  const hour = now.getHours()
  const baseTime = `${String(hour).padStart(2, '0')}30`

  try {
    const url =
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst` +
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

    const items = data.response.body.items.item

    const tempItem = items.find(item => item.category === 'T1H')
    const rainItem = items.find(item => item.category === 'PTY')

    const temp = tempItem ? Math.round(Number(tempItem.obsrValue)) : '-'
    const pty = rainItem ? Number(rainItem.obsrValue) : 0

    let weatherIndex = WEATHERS.findIndex(w => w.label === '맑음')

    if (pty === 1 || pty === 5) {
      weatherIndex = WEATHERS.findIndex(w => w.label === '비')
    } else if (pty === 2 || pty === 6) {
      weatherIndex = WEATHERS.findIndex(w => w.label === '눈')
    } else if (pty === 3 || pty === 7) {
      weatherIndex = WEATHERS.findIndex(w => w.label === '눈')
    }

    const hourNow = new Date().getHours()
    if (hourNow >= 19 || hourNow < 6) {
      weatherIndex = WEATHERS.findIndex(w => w.label === '밤')
    }

    setWeatherLocation(`📍 대전 ${temp}°C`)
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
    if (!diaryText.trim()) { showToast('일기 내용을 입력해주세요 ✏️'); return }
    if (selectedWeather === null) { showToast('날씨를 선택해주세요 🌤️'); return }
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

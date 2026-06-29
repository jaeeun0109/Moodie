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
    if (!key) { setWeatherLocation('⚙️ API 키 미설정'); return }
    if (!navigator.geolocation) { setWeatherLocation('📍 위치 불가'); return }
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const { latitude: lat, longitude: lon } = pos.coords
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&lang=kr&units=metric`
        )
        const data = await res.json()
        if (data.cod !== 200) { setWeatherLocation('⚠️ API 오류'); return }
        setWeatherLocation(`📍 ${data.name} ${Math.round(data.main.temp)}°C`)
        const mapped = mapOwmCode(data.weather[0].id)
        if (mapped !== null) setSelectedWeather(prev => prev === null ? mapped : prev)
      } catch { setWeatherLocation('⚠️ 날씨 오류') }
    }, () => setWeatherLocation('📍 위치 거부됨'))
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

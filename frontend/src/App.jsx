import { useState, useEffect, useCallback } from 'react'
import { WEATHERS, mapKmaWeather } from './constants/weathers'
import WriteSection from './components/WriteSection'
import FeedSection from './components/FeedSection'
import CalendarSection from './components/CalendarSection'
import SettingsModal from './components/SettingsModal'
import './App.css'

const TABS = [
  { key: 'calendar', label: '📅' },
  { key: 'write', label: '✍️' },
  { key: 'feed', label: '📖' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar')
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem('diaryEntries') || '[]'))
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('weatherApiKey') || '')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toast, setToast] = useState({ msg: '', show: false })
  const [weatherInfo, setWeatherInfo] = useState(null)

  const [schedules, setSchedules] = useState(() => JSON.parse(localStorage.getItem('schedules') || '[]'))

  const [selectedMood, setSelectedMood] = useState(null)
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

  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules))
  }, [schedules])

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2200)
  }, [])

  const fetchWeather = useCallback(async (key) => {
  if (!key) {
    setWeatherInfo(null)
    return
  }

  const nx = 67
  const ny = 100

  const getBaseDateTime = () => {
    const now = new Date()
    const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23]

    let baseHour = baseTimes.filter(time => now.getHours() >= time).pop()

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
      setWeatherInfo({
        emoji: '⚠️',
        label: 'API 오류',
        city: '',
        temp: null,
      })
      return
    }

    const items = data.response.body.items.item

    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const todayDate = `${yyyy}${mm}${dd}`
    const targetTime = `${String(today.getHours()).padStart(2, '0')}00`

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
    const weather = WEATHERS[weatherIndex]

    setWeatherInfo({
      emoji: weather.emoji,
      label: weather.label,
      city: '대전',
      temp: Math.round(temp),
    })
  } catch (error) {
    console.error(error)
    setWeatherInfo({
      emoji: '⚠️',
      label: '기상청 오류',
      city: '',
      temp: null,
    })
  }
}, [])

  useEffect(() => {
    fetchWeather(apiKey)
  }, [apiKey, fetchWeather])

  const saveEntry = useCallback(({ text, mood, tags, date }) => {
    if (!text.trim()) { showToast('일기 내용을 입력해주세요 ✏️'); return false }
    if (mood === null || mood === undefined) { showToast('기분을 선택해주세요 🌤️'); return false }
    const entry = {
      id: Date.now(),
      date: date || new Date().toISOString(),
      weather: WEATHERS[mood],
      text: text.trim(),
      tags: [...tags],
    }
    setEntries(prev => [entry, ...prev])
    showToast('기록되었어요 ✨')
    return true
  }, [showToast])

  const handleWriteSave = () => {
    const ok = saveEntry({ text: diaryText, mood: selectedMood, tags: currentTags })
    if (ok) {
      setDiaryText('')
      setSelectedMood(null)
      setCurrentTags([])
    }
  }

  const deleteEntry = (id) => {
    if (!confirm('이 기록을 삭제할까요?')) return
    setEntries(prev => prev.filter(e => e.id !== id))
    showToast('삭제되었어요')
  }

  const saveSchedule = useCallback(({ date, title, time }) => {
    if (!title || !title.trim()) { showToast('일정 내용을 입력해주세요 📅'); return false }
    setSchedules(prev => [...prev, { id: Date.now(), date, title: title.trim(), time: time || '' }])
    showToast('일정이 추가되었어요 📅')
    return true
  }, [showToast])

  const deleteSchedule = (id) => {
    if (!confirm('이 일정을 삭제할까요?')) return
    setSchedules(prev => prev.filter(s => s.id !== id))
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
        <div className="logo">Moodie</div>
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
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            diaryText={diaryText}
            setDiaryText={setDiaryText}
            currentTags={currentTags}
            setCurrentTags={setCurrentTags}
            weatherInfo={weatherInfo}
            onSave={handleWriteSave}
          />
        )}
        {activeTab === 'feed' && (
          <FeedSection entries={entries} onDelete={deleteEntry} />
        )}
        {activeTab === 'calendar' && (
          <CalendarSection
            entries={entries}
            schedules={schedules}
            onDeleteSchedule={deleteSchedule}
            onSaveSchedule={saveSchedule}
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

import { useState } from 'react'
import { WEATHERS } from '../constants/weathers'

function getTodayStr() {
  const now = new Date()
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}요일`
}

export default function WriteSection({ selectedWeather, setSelectedWeather, diaryText, setDiaryText, currentTags, setCurrentTags, weatherLocation, onSave }) {
  const [tagInput, setTagInput] = useState('')

  const addTag = () => {
    let val = tagInput.trim()
    if (!val) return
    if (!val.startsWith('#')) val = '#' + val
    if (currentTags.includes(val) || currentTags.length >= 5) return
    setCurrentTags(prev => [...prev, val])
    setTagInput('')
  }

  const removeTag = (tag) => setCurrentTags(prev => prev.filter(t => t !== tag))

  return (
    <div className="write-card">
      <div className="write-top">
        <div className="write-date">{getTodayStr()}</div>
        <div className="weather-location">{weatherLocation}</div>
      </div>

      <div className="weather-picker-label">오늘의 날씨 & 기분을 선택해요</div>
      <div className="weather-grid">
        {WEATHERS.map((w, i) => (
          <button
            key={w.label}
            className={`weather-btn${selectedWeather === i ? ' selected' : ''}`}
            title={w.label}
            onClick={() => setSelectedWeather(i)}
          >
            <span>{w.emoji}</span>
            <span className="weather-label">{w.label}</span>
          </button>
        ))}
      </div>

      <div className="mood-row">
        <div className="mood-desc">선택한 날씨가 오늘의 기분이에요</div>
        <div className="selected-weather-info">
          <span className="selected-weather-emoji">
            {selectedWeather !== null ? WEATHERS[selectedWeather].emoji : '—'}
          </span>
          <span>
            {selectedWeather !== null
              ? `${WEATHERS[selectedWeather].label} — ${WEATHERS[selectedWeather].mood} 하루`
              : '날씨를 선택해주세요'}
          </span>
        </div>
      </div>

      <textarea
        value={diaryText}
        onChange={e => setDiaryText(e.target.value)}
        placeholder={'오늘 하루를 기록해보세요...\n날씨처럼 흘러가는 감정들을 담아두어요 🌿'}
        maxLength={1000}
      />

      <div className="tag-row">
        {currentTags.map(tag => (
          <span key={tag} className="tag">
            {tag} <span className="tag-remove" onClick={() => removeTag(tag)}>×</span>
          </span>
        ))}
        <div className="tag-input-wrap">
          <input
            className="tag-input"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTag()}
            placeholder="태그 추가 (예: #산책)"
            maxLength={15}
          />
          <button className="tag-add-btn" onClick={addTag}>+</button>
        </div>
      </div>

      <div className="write-footer">
        <div className="char-count"><span>{diaryText.length}</span>/1000</div>
        <button className="submit-btn" onClick={onSave}>기록하기 ✨</button>
      </div>
    </div>
  )
}

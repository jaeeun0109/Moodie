import { useState } from 'react'
import { WEATHERS } from '../constants/weathers'

function getTodayStr() {
  const now = new Date()
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}요일`
}

export default function WriteSection({ selectedMood, setSelectedMood, diaryText, setDiaryText, currentTags, setCurrentTags, weatherInfo, onSave }) {
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
      </div>

      {/* 오늘의 실제 날씨 - API에서 자동으로 가져온 날씨 (고정) */}
      {weatherInfo ? (
        <div className="today-weather-bar">
          <span className="today-weather-emoji">{weatherInfo.emoji}</span>
          <span className="today-weather-text">
            {weatherInfo.city && <>{weatherInfo.city} · </>}
            <strong>{weatherInfo.label}</strong>
            {weatherInfo.temp !== null && ` ${weatherInfo.temp}°C`}
          </span>
        </div>
      ) : (
        <div className="today-weather-bar no-weather">
          <span>⚙️</span>
          <span>날씨 정보를 보려면 API 키를 설정해주세요</span>
        </div>
      )}

      {/* 오늘의 무드 - 사용자가 직접 선택 */}
      <div className="weather-picker-label">오늘의 기분을 날씨로 표현해요 🌈</div>
      <div className="weather-grid">
        {WEATHERS.map((w, i) => (
          <button
            key={w.label}
            className={`weather-btn${selectedMood === i ? ' selected' : ''}`}
            title={w.label}
            onClick={() => setSelectedMood(i)}
          >
            {w.emoji}
          </button>
        ))}
      </div>

      <div className="mood-row">
        <div className="mood-desc">선택한 기분</div>
        <div className="selected-weather-info">
          <span className="selected-weather-emoji">
            {selectedMood !== null ? WEATHERS[selectedMood].emoji : '—'}
          </span>
          <span>
            {selectedMood !== null
              ? `${WEATHERS[selectedMood].label} — ${WEATHERS[selectedMood].mood} 하루`
              : '기분을 선택해주세요'}
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

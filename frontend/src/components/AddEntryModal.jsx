import { useState } from 'react'
import { WEATHERS } from '../constants/weathers'

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const dow = days[new Date(y, m - 1, d).getDay()]
  return `${y}년 ${m}월 ${d}일 ${dow}요일`
}

export default function AddEntryModal({ date, weatherInfo, onSave, onClose }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [diaryText, setDiaryText] = useState('')
  const [currentTags, setCurrentTags] = useState([])
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
    <div
      className="modal-overlay open bottom"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal add-modal">
        <div className="modal-header">
          <h2>{formatDate(date)}</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {weatherInfo && (
          <div className="today-weather-bar" style={{ marginBottom: '14px' }}>
            <span className="today-weather-emoji">{weatherInfo.emoji}</span>
            <span className="today-weather-text">
              {weatherInfo.city && <>{weatherInfo.city} · </>}
              <strong>{weatherInfo.label}</strong>
              {weatherInfo.temp !== null && ` ${weatherInfo.temp}°C`}
            </span>
          </div>
        )}

        <div className="weather-picker-label">기분을 날씨로 표현해요 🌈</div>
        <div className="weather-grid">
          {WEATHERS.map((w, i) => (
            <button
              key={w.label}
              className={`weather-btn${selectedMood === i ? ' selected' : ''}`}
              title={w.label}
              onClick={() => setSelectedMood(i)}
            >
              <span>{w.emoji}</span>
              <span className="weather-label">{w.label}</span>
            </button>
          ))}
        </div>

        <div className="mood-row" style={{ marginBottom: '12px' }}>
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
          placeholder="이 날의 하루를 기록해보세요..."
          maxLength={1000}
          style={{ marginBottom: '10px' }}
        />

        <div className="tag-row" style={{ marginBottom: '14px' }}>
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
              placeholder="태그 추가"
              maxLength={15}
            />
            <button className="tag-add-btn" onClick={addTag}>+</button>
          </div>
        </div>

        <div className="write-footer">
          <div className="char-count"><span>{diaryText.length}</span>/1000</div>
          <button
            className="submit-btn"
            onClick={() => onSave({ text: diaryText, mood: selectedMood, tags: currentTags })}
          >
            기록하기 ✨
          </button>
        </div>
      </div>
    </div>
  )
}

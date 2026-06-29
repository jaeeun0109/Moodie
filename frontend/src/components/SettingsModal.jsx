import { useState } from 'react'

export default function SettingsModal({ apiKey, onSave, onClose }) {
  const [inputVal, setInputVal] = useState(apiKey)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!inputVal.trim()) {
      alert('API 키를 입력해주세요.')
      return
    }

    onSave(inputVal.trim())
  }

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <form className="modal" onSubmit={handleSubmit}>
        <h2>⚙️ 날씨 API 설정</h2>

        <label>OpenWeatherMap API 키</label>
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="openweathermap.org에서 발급받은 키 입력"
        />

        <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '16px', lineHeight: '1.6' }}>
          openweathermap.org에서 무료 API 키를 발급받아 입력하면<br />
          현재 위치의 날씨를 자동으로 불러와요.
        </p>

        <div className="modal-footer">
          <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
          <button type="submit" className="btn-primary">저장</button>
        </div>
      </form>
    </div>
  )
}
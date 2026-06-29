import { useState } from 'react'

export default function SettingsModal({ apiKey, onSave, onClose }) {
  const [inputVal, setInputVal] = useState(apiKey)

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <h2>⚙️ 날씨 API 설정</h2>
        <label>OpenWeatherMap API 키</label>
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="무료 키: openweathermap.org 에서 발급"
        />
        <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '16px', lineHeight: '1.6' }}>
          API 키 없이도 날씨 이모지를 직접 선택할 수 있어요.<br />
          자동 날씨 연동을 원하면 무료 키를 입력해주세요.
        </p>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>취소</button>
          <button className="btn-primary" onClick={() => onSave(inputVal.trim())}>저장</button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'

export default function SettingsModal({ apiKey, onSave, onClose }) {
  const [inputVal, setInputVal] = useState(apiKey)

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <h2>⚙️ 날씨 API 설정</h2>

        <label>기상청 공공데이터 API 키</label>
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="공공데이터포털에서 발급받은 일반 인증키 입력"
        />

        <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '16px', lineHeight: '1.6' }}>
          공공데이터포털에서 기상청 초단기실황조회 API를 활용 신청한 뒤,<br />
          발급받은 일반 인증키를 입력해주세요.
        </p>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>취소</button>
          <button className="btn-primary" onClick={() => onSave(inputVal.trim())}>저장</button>
        </div>
      </div>
    </div>
  )
}
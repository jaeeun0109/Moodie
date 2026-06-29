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

        <label>기상청 공공데이터 API 키</label>
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="공공데이터포털 일반 인증키(Decoding) 입력"
        />

        <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '16px', lineHeight: '1.6' }}>
          저장을 누르면 API 키가 브라우저에 저장되고,<br />
          대전 지역 날씨를 다시 불러옵니다.
        </p>

        <div className="modal-footer">
          <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
          <button type="submit" className="btn-primary">저장</button>
        </div>
      </form>
    </div>
  )
}
import { useState } from 'react'

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const dow = days[new Date(y, m - 1, d).getDay()]
  return `${y}년 ${m}월 ${d}일 ${dow}요일`
}

export default function AddScheduleModal({ date, onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title: title.trim(), time })
  }

  return (
    <div
      className="modal-overlay open bottom"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal add-modal">
        <div className="modal-header">
          <h2>📅 {formatDate(date)}</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <label className="sched-label">일정 내용 *</label>
        <input
          className="sched-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="일정을 입력해주세요"
          autoFocus
          maxLength={50}
        />

        <label className="sched-label">시간 (선택)</label>
        <input
          type="time"
          className="sched-input"
          value={time}
          onChange={e => setTime(e.target.value)}
        />

        <div className="modal-footer" style={{ marginTop: '8px' }}>
          <button className="btn-ghost" onClick={onClose}>취소</button>
          <button className="btn-primary" onClick={handleSave} disabled={!title.trim()}>추가하기</button>
        </div>
      </div>
    </div>
  )
}

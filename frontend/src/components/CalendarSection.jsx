import { useState } from 'react'
import AddScheduleModal from './AddScheduleModal'

const DOW = ['일', '월', '화', '수', '목', '금', '토']

export default function CalendarSection({
  entries, schedules, onDeleteSchedule, onSaveSchedule,
  calYear, calMonth, setCalYear, setCalMonth,
}) {
  const [selectedDay, setSelectedDay] = useState(null)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const changeMonth = (dir) => {
    let m = calMonth + dir
    let y = calYear
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setCalMonth(m)
    setCalYear(y)
    setSelectedDay(null)
  }

  // 일기 기록 map (날짜 → 기분 이모지용)
  const entryMap = {}
  entries.forEach(e => {
    const key = e.date.slice(0, 10)
    if (!entryMap[key]) entryMap[key] = e
  })

  // 일정 map (날짜 → 일정 배열)
  const scheduleMap = {}
  schedules.forEach(s => {
    if (!scheduleMap[s.date]) scheduleMap[s.date] = []
    scheduleMap[s.date].push(s)
  })

  const first = new Date(calYear, calMonth, 1)
  const last = new Date(calYear, calMonth + 1, 0)
  const today = new Date()

  const days = []
  for (let i = 0; i < first.getDay(); i++) {
    days.push({ date: new Date(calYear, calMonth, -first.getDay() + i + 1), otherMonth: true })
  }
  for (let d = 1; d <= last.getDate(); d++) {
    days.push({ date: new Date(calYear, calMonth, d), otherMonth: false })
  }
  const remaining = 7 - ((first.getDay() + last.getDate()) % 7 || 7)
  for (let i = 1; i <= remaining && remaining < 7; i++) {
    days.push({ date: new Date(calYear, calMonth + 1, i), otherMonth: true })
  }

  const daySchedules = selectedDay
    ? [...(scheduleMap[selectedDay] || [])].sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
    : []

  const handleSaveSchedule = (data) => {
    const ok = onSaveSchedule({ ...data, date: selectedDay })
    if (ok) setAddModalOpen(false)
  }

  return (
    <div>
      <div className="calendar-wrap">
        <div className="cal-header">
          <div className="cal-title">{calYear}년 {calMonth + 1}월</div>
          <div className="cal-nav">
            <button onClick={() => changeMonth(-1)}>‹</button>
            <button onClick={() => changeMonth(1)}>›</button>
          </div>
        </div>
        <div className="cal-grid">
          {DOW.map((d, i) => (
            <div key={d} className={`cal-dow${i === 0 || i === 6 ? ' weekend' : ''}`}>{d}</div>
          ))}
          {days.map(({ date, otherMonth }) => {
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            const isToday = date.toDateString() === today.toDateString()
            const entry = entryMap[key]
            const isSelected = selectedDay === key
            const dow = date.getDay()
            const isWeekend = dow === 0 || dow === 6
            const schedCount = scheduleMap[key]?.length || 0

            return (
              <div
                key={key}
                className={[
                  'cal-day',
                  otherMonth ? 'other-month' : '',
                  isToday ? 'today' : '',
                  isWeekend && !otherMonth ? 'weekend' : '',
                  isSelected ? 'selected-day' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => !otherMonth && setSelectedDay(isSelected ? null : key)}
              >
                {!otherMonth && entry && <span className="day-weather">{entry.weather.emoji}</span>}
                <span className="day-num">{date.getDate()}</span>
                {!otherMonth && schedCount > 0 && (
                  <span className="day-sched-count">+{schedCount}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {selectedDay && (
        <div style={{ marginTop: '12px' }}>
          <div className="day-action-bar">
            <span className="day-action-date">{selectedDay.replace(/-/g, '.')}</span>
            <button className="add-entry-btn" onClick={() => setAddModalOpen(true)}>
              + 일정 추가
            </button>
          </div>
          <div className="schedule-list">
            {daySchedules.length > 0 ? (
              daySchedules.map(s => (
                <div key={s.id} className="schedule-item">
                  {s.time && <span className="schedule-time">{s.time}</span>}
                  <span className="schedule-title">{s.title}</span>
                  <button className="schedule-del-btn" onClick={() => onDeleteSchedule(s.id)}>×</button>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ padding: '28px' }}>
                <div className="empty-emoji">📭</div>
                <div className="empty-text">이 날의 일정이 없어요</div>
              </div>
            )}
          </div>
        </div>
      )}

      {addModalOpen && selectedDay && (
        <AddScheduleModal
          date={selectedDay}
          onSave={handleSaveSchedule}
          onClose={() => setAddModalOpen(false)}
        />
      )}
    </div>
  )
}

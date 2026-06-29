import { useState } from 'react'
import EntryCard from './EntryCard'

export default function CalendarSection({ entries, onDelete, calYear, calMonth, setCalYear, setCalMonth }) {
  const [selectedDay, setSelectedDay] = useState(null)

  const changeMonth = (dir) => {
    let m = calMonth + dir
    let y = calYear
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setCalMonth(m)
    setCalYear(y)
    setSelectedDay(null)
  }

  const entryMap = {}
  entries.forEach(e => {
    const key = e.date.slice(0, 10)
    if (!entryMap[key]) entryMap[key] = e
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

  const dayEntries = selectedDay ? entries.filter(e => e.date.startsWith(selectedDay)) : []

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
          {['일', '월', '화', '수', '목', '금', '토'].map(d => (
            <div key={d} className="cal-dow">{d}</div>
          ))}
          {days.map(({ date, otherMonth }) => {
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            const isToday = date.toDateString() === today.toDateString()
            const entry = entryMap[key]
            const isSelected = selectedDay === key

            return (
              <div
                key={key}
                className={[
                  'cal-day',
                  otherMonth ? 'other-month' : '',
                  isToday ? 'today' : '',
                  entry ? 'has-entry' : '',
                  isSelected ? 'selected-day' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => setSelectedDay(isSelected ? null : key)}
              >
                {entry && <span className="day-weather">{entry.weather.emoji}</span>}
                <span className="day-num">{date.getDate()}</span>
              </div>
            )
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="feed" style={{ marginTop: '16px' }}>
          {dayEntries.length > 0 ? (
            dayEntries.map(e => <EntryCard key={e.id} entry={e} onDelete={onDelete} />)
          ) : (
            <div className="empty-state" style={{ padding: '30px' }}>
              <div className="empty-emoji">📭</div>
              <div className="empty-text">이 날의 기록이 없어요</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

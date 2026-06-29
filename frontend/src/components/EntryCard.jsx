export default function EntryCard({ entry, onDelete }) {
  const d = new Date(entry.date)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${days[d.getDay()]}`
  const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

  return (
    <div className="entry-card">
      <div className="entry-header">
        <div className="entry-weather-badge">{entry.weather.emoji}</div>
        <div className="entry-meta">
          <div className="entry-date">{dateStr} · {timeStr}</div>
          <div className="entry-weather-name">{entry.weather.label}</div>
          <div className="entry-mood-text">{entry.weather.mood} 하루</div>
        </div>
        <div className="entry-actions">
          <button className="entry-action-btn" onClick={() => onDelete(entry.id)} title="삭제">🗑️</button>
        </div>
      </div>
      <div className="entry-body">
        <div className="entry-text">{entry.text}</div>
        {entry.tags.length > 0 && (
          <div className="entry-tags">
            {entry.tags.map(tag => (
              <span key={tag} className="entry-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

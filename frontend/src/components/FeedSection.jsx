import EntryCard from './EntryCard'

export default function FeedSection({ entries, onDelete }) {
  if (!entries.length) {
    return (
      <div className="feed">
        <div className="empty-state">
          <div className="empty-emoji">🌿</div>
          <div className="empty-text">아직 기록이 없어요.<br />오늘 하루를 담아보세요.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="feed">
      {entries.map(entry => (
        <EntryCard key={entry.id} entry={entry} onDelete={onDelete} />
      ))}
    </div>
  )
}

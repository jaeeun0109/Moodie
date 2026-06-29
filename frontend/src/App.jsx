import "./App.css";

function App() {
  return (
    <div className="container">
      <h1>🌤️ Moodie</h1>
      <p className="subtitle">오늘의 감정을 기록해보세요.</p>

      <div className="weather-card">
        <h2>☀️ 오늘의 날씨</h2>
        <p className="temp">26℃</p>
        <p>맑음</p>
      </div>

      <div className="diary-card">
        <h2>📝 오늘의 일기</h2>

        <input
          type="text"
          placeholder="제목을 입력하세요"
        />

        <textarea
          placeholder="오늘 하루는 어땠나요?"
        ></textarea>

        <select>
          <option>😊 행복</option>
          <option>😐 보통</option>
          <option>😢 슬픔</option>
          <option>😡 화남</option>
        </select>

        <button>저장하기</button>
      </div>
    </div>
  );
}

export default App;
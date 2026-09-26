import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [season, setSeason] = useState("");
  const [statusClass, setStatusClass] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [seasonsList, setSeasonsList] = useState(null);

  const sendSeason = () => {
    if (!season.trim()) {
      setStatusClass("error");
      setStatusMessage("Пожалуйста, введите время года!");
      return;
    }

    setStatusClass("info");
    setStatusMessage("Отправка...");

    axios
      .post("http://localhost:5000/api/send-season", { season: season })
      .then((response) => {
        setStatusClass("success");
        setStatusMessage(response.data.message);
        setSeason("");
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        setStatusClass("error");
        setStatusMessage(
          error.response?.data?.message || "Не удалось связаться с сервером.",
        );
      });
  };

  const getSeasonsByDate = () => {
    if (!selectedDate) {
      setStatusClass("error");
      setStatusMessage("Пожалуйста, выберите дату!");
      return;
    }

    setStatusClass("info");
    setStatusMessage("Поиск записей...");

    axios
      .get("http://localhost:5000/api/get-seasons-by-date", {
        params: { date: selectedDate },
      })
      .then((response) => {
        setStatusClass("success");
        setStatusMessage("Данные успешно получены!");
        setSeasonsList(response.data.message);
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        setStatusClass("error");
        setStatusMessage(
          error.response?.data?.message ||
            "Не удалось получить данные с сервера.",
        );
      });
  };

  return (
    <div className="card">
      <h2>Отправка времени года на backend сервис</h2>
      <p className="subtitle">Введите время года, чтобы записать его в файл</p>

      <div className="input-group">
        <input
          type="text"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && sendSeason()}
          placeholder="Например: Осень"
          autoComplete="off"
        />
        <button onClick={sendSeason}>Отправить</button>
      </div>

      {statusClass && (
        <div id="status" className={statusClass}>
          {statusMessage}
        </div>
      )}

      <hr className="divider" />

      <h2>Просмотр записей по дате</h2>
      <p className="subtitle">
        Выберите дату, чтобы узнать, какие времена года вводили в этот день
      </p>

      <div className="input-group">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button className="secondary-btn" onClick={getSeasonsByDate}>
          Показать
        </button>
      </div>

      {seasonsList && (
        <div className="output-group">
          <h3>Времена года за {selectedDate}:</h3>
          <textarea readOnly rows="6" value={seasonsList}></textarea>
        </div>
      )}
    </div>
  );
}

export default App;

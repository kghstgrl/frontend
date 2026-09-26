import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [season, setSeason] = useState("");
  const [statusClass, setStatusClass] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

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
          error.response?.data?.message ||
            "Не удалось связаться с сервером",
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
    </div>
  );
}

export default App;

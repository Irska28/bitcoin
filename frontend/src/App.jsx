import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [bitcoin, setBitcoin] = useState([]);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const fetchPrices = () => {
    if (!fromTime || !toTime) return;

    const fromTimestamp = Math.floor(new Date(fromTime).getTime() / 1000);
    const toTimestamp = Math.floor(new Date(toTime).getTime() / 1000);
    
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range`,
        {
          params: {
            vs_currency: "eur",
            from: fromTimestamp,
            to: toTimestamp,
          },
        }
      )
      .then((res) => setBitcoin(res.data.prices))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Bitcoin Prices</h1>

      <div>
        <label>
          From:
          <input
            type="datetime-local"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
          />
        </label>

        <label>
          To:
          <input
            type="datetime-local"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
          />
        </label>

        <button onClick={fetchPrices}>Get Prices</button>
      </div>

      <ul>
        {bitcoin.map(([timestamp, price], index) => (
          <li key={index}>
            {new Date(timestamp).toLocaleString()} : €{price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

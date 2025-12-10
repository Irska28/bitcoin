import { useState } from "react";
import axios from "axios";
import BitcoinChart from "./Chart";
import "./App.css";

function App() {
  const [bitcoin, setBitcoin] = useState([]);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [highestVolumeInfo, setHighestVolumeInfo] = useState(null);

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
      .then((res) => {
        setBitcoin(res.data.prices);

        if (res.data.total_volumes && res.data.total_volumes.length > 0) {
          const maxVolume = res.data.total_volumes.reduce((max, current) =>
            current[1] > max[1] ? current : max
          );

          setHighestVolumeInfo({
            date: new Date(maxVolume[0]).toLocaleString(),
            volume: maxVolume[1]
          });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Bitcoin Prices</h1>
      <h3>The app will not work if the time is in the future</h3>

      <div className="dates">
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


      {bitcoin.length > 0 && <BitcoinChart data={bitcoin} />}

      {highestVolumeInfo && (
        <div className="volume-info">
          <h3>Highest Trading Volume</h3>
          <p><strong>Date:</strong> {highestVolumeInfo.date}</p>
          <p><strong>Volume:</strong> €{highestVolumeInfo.volume.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
      )}

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
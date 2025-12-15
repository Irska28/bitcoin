import { useState } from "react";
import BitcoinChart from "./Chart";
import "./App.css";
import "./Downtrend"
function App() {
  const [bitcoin, setBitcoin] = useState([]);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [highestVolumeInfo, setHighestVolumeInfo] = useState(null);
  const [currentState, setcurrentState] = useState('home');
  const [longestDownwardDays, setLongestDownwardDays] = useState(null);

  const [maxPriceInfo, setMaxPriceInfo] = useState(null);
  const [minPriceInfo, setMinPriceInfo] = useState(null)

  const [bestTrade, setBestTrade] = useState(null);



  const getLastPricePerDay = (prices) => {
    const dailyMap = {};

    prices.forEach(([timestamp, price]) => {
      const date = new Date(timestamp).toISOString().split('T')[0];
      dailyMap[date] = [timestamp, price];
    });

    return Object.values(dailyMap).sort((a, b) => a[0] - b[0]);
  };

  const lastPrices = getLastPricePerDay(bitcoin);




  const findBestBuySellDays = (prices) => {
    if (!prices || prices.length < 2) return null;

    let minPrice = prices[0][1];
    let minIndex = 0;

    let maxProfit = 0;
    let buyIndex = null;
    let sellIndex = null;

    for (let i = 1; i < prices.length; i++) {
      const price = prices[i][1];

      const profit = price - minPrice;
      if (profit > maxProfit) {
        maxProfit = profit;
        buyIndex = minIndex;
        sellIndex = i;
      }

      if (price < minPrice) {
        minPrice = price;
        minIndex = i;
      }
    }

    if (maxProfit <= 0) {
      return { shouldTrade: false };
    }

    return {
      shouldTrade: true,
      buy: prices[buyIndex],
      sell: prices[sellIndex],
      profit: maxProfit
    };
  };



  const findLongestDownwardTrend = (prices) => {
    if (!prices || prices.length === 0) return 0;

    const dailyPrices = {};
    prices.forEach(([timestamp, price]) => {
      const date = new Date(timestamp).toISOString().split('T')[0];
      if (!dailyPrices[date]) {
        dailyPrices[date] = [];
      }
      dailyPrices[date].push(price);
    });

    const days = Object.keys(dailyPrices)
      .sort()
      .map(date => {
        const pricesForDay = dailyPrices[date];
        const avgPrice = pricesForDay.reduce((sum, p) => sum + p, 0) / pricesForDay.length;
        return avgPrice;
      });

    let longestStreak = 0;
    let currentStreak = 0;

    for (let i = 1; i < days.length; i++) {
      if (days[i] < days[i - 1]) {
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;

      }
    }

    return longestStreak;
  };

  const fetchPrices = () => {
    if (!fromTime || !toTime) return;

    const today = new Date().toISOString().split('T')[0];
    if (fromTime > today || toTime > today) {
      alert("Cannot select future dates!");
      return;
    }

    const fromTimestamp = Math.floor(new Date(fromTime).getTime() / 1000);
    const toTimestamp = Math.floor(new Date(toTime).getTime() / 1000);

    fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${fromTimestamp}&to=${toTimestamp}`
    )
      .then(res => res.json())
      .then((data) => {
        setBitcoin(data.prices);

        if (data.total_volumes && data.total_volumes.length > 0) {
          const maxVolume = data.total_volumes.reduce((max, current) =>
            current[1] > max[1] ? current : max
          );

          setHighestVolumeInfo({
            date: new Date(maxVolume[0]).toLocaleString(),
            volume: maxVolume[1]
          });
        }

        const downwardDays = findLongestDownwardTrend(data.prices);
        setLongestDownwardDays(downwardDays);



        if (data.prices && data.prices.length > 0) {
          const maxPriceData = data.prices.reduce((max, current) =>
            current[1] > max[1] ? current : max
          );
          setMaxPriceInfo({
            date: new Date(maxPriceData[0]).toLocaleString(),
            price: maxPriceData[1]
          });
        }


        if (data.prices && data.prices.length > 0) {
          const minPriceData = data.prices.reduce((min, current) =>
            current[1] < min[1] ? current : min
          );
          setMinPriceInfo({
            date: new Date(minPriceData[0]).toLocaleString(),
            price: minPriceData[1]
          });
        }


        const trade = findBestBuySellDays(data.prices);
        setBestTrade(trade);

      })


  };

  return (
    <div className="page">
      <div className="container">
        <h1>Bitcoin Prices</h1>


        <div className="dates">
          <label>
            From:
            <input
              type="date"
              value={fromTime}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFromTime(e.target.value)}
            />
          </label>

          <label>
            To:
            <input
              type="date"
              value={toTime}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setToTime(e.target.value)}
            />
          </label>


        </div>
        <div className="center">
          <button onClick={fetchPrices}>Get Prices</button>
        </div>

        {bitcoin.length > 0 && <BitcoinChart data={lastPrices} />}


        {longestDownwardDays !== null && (
          <div className="volume-info">
            <h3>Longest Downward Trend</h3>
            {longestDownwardDays === 0 ? (
              <p>No downward trends during these dates.</p>
            ) : (
              <p><strong>Days:</strong> {longestDownwardDays}</p>
            )}
          </div>
        )}

        {highestVolumeInfo && (
          <div className="volume-info">
            <h3>Highest Trading Volume</h3>
            <p><strong>Date:</strong> {highestVolumeInfo.date}</p>
            <p><strong>Volume:</strong> €{highestVolumeInfo.volume.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>

          </div>
        )}

        {maxPriceInfo && (
          <div className="max-info">
            <h3>Max price</h3>
            <p><strong>Max price:</strong> {maxPriceInfo.price}</p>
            <p><strong>Date:</strong>{maxPriceInfo.date}</p>
          </div>
        )}


        {minPriceInfo && (
          <div className="max-info">
            <h3>Min price</h3>
            <p><strong>Min price: </strong> {minPriceInfo.price}</p>
            <p><strong>Date: </strong> {minPriceInfo.date}</p>
          </div>
        )}

        {bestTrade && (
          <div className="volume-info">
            <h3>Best Bitcoin Trade</h3>

            {!bestTrade.shouldTrade ? (
              <p>Price only decreases — do not buy or sell.</p>
            ) : (
              <>
                <p>
                  <strong>Buy:</strong>{" "}
                  {new Date(bestTrade.buy[0]).toLocaleString()} (€{bestTrade.buy[1].toFixed(2)})
                </p>
                <p>
                  <strong>Sell:</strong>{" "}
                  {new Date(bestTrade.sell[0]).toLocaleString()} (€{bestTrade.sell[1].toFixed(2)})
                </p>
                <p>
                  <strong>Profit:</strong> €{bestTrade.profit.toFixed(2)}
                </p>
              </>
            )}
          </div>
        )}

        <div className="center">
          <button onClick={() => setcurrentState('bitcoin')} style={{ cursor: 'pointer' }}>All price changes</button>
        </div>

        {currentState === 'bitcoin' && (
          <div>
            <div className="center">
              <button onClick={() => setcurrentState('home')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Close price changes</button>
            </div>
            <ul>
              {bitcoin.map(([timestamp, price], index) => (
                <li key={index}>
                  {new Date(timestamp).toLocaleString()} : €{price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}



      </div>

      <footer className="footer-container">
        <div className="footer-inner">
          <h2>Scrooge McDuck´s bitcoin tracking software</h2>
          <a href="https://www.investopedia.com/terms/b/bitcoin.asp">What is bitcoin?</a>
        </div>
      </footer>

    </div>
  );
}

export default App;
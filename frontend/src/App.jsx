import { useState, useEffect } from 'react';
import axios from "axios";
import "./App.css"

function App() {
  const [bitcoin, setBitcoin] = useState([])

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=1765096315&to=1765182715")
      .then((res) => setBitcoin(res.data.prices))
      .catch(err => console.error(err));
  }, [])

  

  return (
    <div>
      <h1>Bitcoin Prices</h1>
      <ul>
        {bitcoin.map(([timestamp, price], index) => (
          <li key={index}>
            {new Date(timestamp).toLocaleDateString()}: €{price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>  
  )
}

export default App

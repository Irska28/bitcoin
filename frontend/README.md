Bitcoin Price Tracker

A frontend-only React application that fetches and visualizes Bitcoin price data using the CoinGecko API. The app allows users to select a date range and view price charts, statistics, and trading insights such as the best buy/sell days.

Features

📈 Bitcoin price chart for a selected date range

📅 Date range selection (past dates only)

🔻 Longest downward price trend (in days)

💰 Highest trading volume in the selected range

⬆️ Maximum Bitcoin price and date

⬇️ Minimum Bitcoin price and date

🔄 Best day to buy and best later day to sell for maximum profit

🚫 Indicates when no profitable trade is possible

📃 View all price changes as a list

Technologies Used

React (useState, functional components)

JavaScript (ES6+)

CoinGecko Public API

CSS for styling

How the App Works

The user selects a from and to date.

The app fetches Bitcoin price data from the CoinGecko API.

Prices are displayed on a chart.

The app calculates:

Longest downward price trend

Highest trading volume

Minimum and maximum prices

Best buy and sell days to maximize profit

If prices only decrease, the app advises not to trade.

All calculations are done on the client side — no backend is used.
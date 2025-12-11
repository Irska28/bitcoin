import React from 'react';

const DownwardTrend = ({ prices }) => {
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

  const longestDownwardDays = findLongestDownwardTrend(prices);

  return (
    <div className="volume-info">
      <h3>Longest Downward Trend</h3>
      <p><strong>Days:</strong> {longestDownwardDays}</p>
    </div>
  );
};

export default DownwardTrend;
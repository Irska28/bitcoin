import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function BitcoinChart({ data }) {
  const chartData = {
    labels: data.map(([timestamp]) => new Date(timestamp).toLocaleString()),
    datasets: [
      {
        label: "Bitcoin Price (EUR)",
        data: data.map(([, price]) => price),
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.1)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Date & Time",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Price (EUR)",
        },
      },
    },
  };

  return (
    <div style={{ height: "400px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default BitcoinChart;
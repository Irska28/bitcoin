import { useEffect, useRef } from "react";

function BitcoinChart({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data?.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const pad = { top: 40, right: 40, bottom: 50, left: 40 };

    const prices = data.map(d => d[1]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;

    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    const points = data.map(([, price], i) => {
      const x = pad.left + (chartW / (data.length - 1)) * i;
      const y = pad.top + chartH - ((price - min) / range) * chartH;
      return { x, y };
    });

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const y = pad.top + (chartH / steps) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
    }

    // Price labels
    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    for (let i = 0; i <= steps; i++) {
      const p = max - (range / steps) * i;
      const y = pad.top + (chartH / steps) * i;
      ctx.fillText(`€${p.toFixed(2)}`, pad.left - 8, y + 4);
    }

    // X-axis date labels
    ctx.textAlign = "center";
    const labelCount = 5;
    const step = Math.floor(data.length / labelCount);
    for (let i = 0; i < data.length; i += step) {
      const { x } = points[i];
      const date = new Date(data[i][0]).toLocaleDateString();
      ctx.fillText(date, x, height - pad.bottom + 20);
    }

    // Gradient under curve
    const gradient = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
    gradient.addColorStop(0, "rgba(255, 159, 64, 0.3)");
    gradient.addColorStop(1, "rgba(255, 159, 64, 0.05)");

    ctx.beginPath();
    points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.lineTo(points.at(-1).x, height - pad.bottom);
    ctx.lineTo(points[0].x, height - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line stroke
    ctx.beginPath();
    points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.strokeStyle = "rgb(255,159,64)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Chart title
    ctx.fillStyle = "#333";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Bitcoin Price (EUR)", width / 2, 25);
  }, [data]);

  return (
    <div
      style={{
        padding: "20px",
        background: "#f9f9f9",
        borderRadius: "8px",
        margin: "20px 0",
      }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}
      />
    </div>
  );
}

export default BitcoinChart;

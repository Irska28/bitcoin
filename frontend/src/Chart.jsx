import { useEffect, useRef } from "react";

function BitcoinChart({ data }) {
  const canvasRef = useRef(null);
  

  useEffect(() => {
    if (!data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    
    ctx.clearRect(0, 0, width, height);

    
    const prices = data.map(([, price]) => price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    
    const padding = { top: 40, right: 40, bottom: 60, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

 
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    
    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    for (let i = 0; i <= gridLines; i++) {
      const price = maxPrice - (priceRange / gridLines) * i;
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.fillText(`€${price.toFixed(2)}`, padding.left - 10, y + 4);
    }

   
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";
    ctx.font = "bold 14px Arial";
    ctx.fillText("Price (EUR)", 0, 0);
    ctx.restore();

    
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";
    ctx.font = "bold 14px Arial";
    ctx.fillText("Date & Time", width / 2, height - 10);

   
    const labelCount = Math.min(5, data.length);
    const labelStep = Math.floor(data.length / labelCount);
    ctx.fillStyle = "#666";
    ctx.font = "11px Arial";
    ctx.textAlign = "center";
    
    for (let i = 0; i < data.length; i += labelStep) {
      const x = padding.left + (chartWidth / (data.length - 1)) * i;
      const date = new Date(data[i][0]);
      const label = date.toLocaleDateString();
      
      ctx.save();
      ctx.translate(x, height - padding.bottom + 15);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(label, 0, 0);
      ctx.restore();
    }

   
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, "rgba(255, 159, 64, 0.3)");
    gradient.addColorStop(1, "rgba(255, 159, 64, 0.05)");

    ctx.beginPath();
    data.forEach(([timestamp, price], index) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * index;
      const y =
        height -
        padding.bottom -
        ((price - minPrice) / priceRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    // Fill area under line
    const lastX = padding.left + chartWidth;
    const bottomY = height - padding.bottom;
    ctx.lineTo(lastX, bottomY);
    ctx.lineTo(padding.left, bottomY);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw the line itself
    ctx.beginPath();
    data.forEach(([timestamp, price], index) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * index;
      const y =
        height -
        padding.bottom -
        ((price - minPrice) / priceRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = "rgb(255, 159, 64)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw points
    data.forEach(([timestamp, price], index) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * index;
      const y =
        height -
        padding.bottom -
        ((price - minPrice) / priceRange) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "rgb(255, 159, 64)";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw title
    ctx.fillStyle = "#333";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Bitcoin Price (EUR)", width / 2, 25);

  }, [data]);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", margin: "20px 0" }}>
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
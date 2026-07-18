import { useEffect, useRef, useState } from 'react';

interface TrendChartPoint {
  date: string;
  amount: number;
}

interface TrendChartProps {
  data: TrendChartPoint[];
  baseCurrency: string;
}

export default function TrendChart({ data }: TrendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 320, height: 160 });

  // Monitor container width to support responsive redrawing
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        setDimensions({ width, height: 160 });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Redraw trendline canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;

    // High-DPI canvas backing store
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const values = data.map(d => d.amount);
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values, 0);
    const range = maxVal - minVal || 1;

    const activePoints = values.filter(v => v > 0).length;
    if (data.length === 0 || activePoints === 0) {
      ctx.fillStyle = '#71717a';
      ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No spending trend', width / 2, height / 2);
      return;
    }

    const pad = { top: 20, bottom: 24, left: 16, right: 16 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    const step = chartW / (data.length - 1 || 1);

    // 1. Draw gradient area fill
    ctx.beginPath();
    ctx.lineTo(pad.left, pad.top + chartH);
    for (let i = 0; i < data.length; i++) {
      const x = pad.left + i * step;
      const y = pad.top + chartH - ((data[i].amount - minVal) / range) * chartH;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(pad.left + (data.length - 1) * step, pad.top + chartH);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
    grad.addColorStop(1, 'rgba(99, 102, 241, 0.02)');
    ctx.fillStyle = grad;
    ctx.fill();

    // 2. Draw curve path line
    ctx.beginPath();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    for (let i = 0; i < data.length; i++) {
      const x = pad.left + i * step;
      const y = pad.top + chartH - ((data[i].amount - minVal) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. Draw dot nodes
    for (let i = 0; i < data.length; i++) {
      const x = pad.left + i * step;
      const y = pad.top + chartH - ((data[i].amount - minVal) / range) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 4. Draw x-axis labels (render every Nth label to prevent text overlaps)
    ctx.fillStyle = '#71717a';
    ctx.font = '9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    
    const interval = Math.max(1, Math.floor(data.length / 5));
    for (let i = 0; i < data.length; i += interval) {
      const x = pad.left + i * step;
      const d = new Date(data[i].date + 'T00:00:00'); // enforce local interpretation
      const label = (d.getMonth() + 1) + '/' + d.getDate();
      ctx.fillText(label, x, pad.top + chartH + 16);
    }

  }, [dimensions, data]);

  return (
    <div ref={containerRef} className="w-full relative min-h-[160px]">
      <canvas ref={canvasRef} className="block mx-auto rounded-lg" id="chartTrend" />
    </div>
  );
}

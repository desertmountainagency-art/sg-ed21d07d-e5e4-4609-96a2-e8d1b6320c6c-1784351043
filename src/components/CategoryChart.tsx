import { useEffect, useRef, useState } from 'react';
import { CURRENCIES } from '../constants';

interface CategoryChartProps {
  data: [string, number][]; // Array of [CategoryName, Amount]
  baseCurrency: string;
}

export default function CategoryChart({ data, baseCurrency }: CategoryChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 320, height: 220 });

  // Format currency helper
  const formatCurrency = (amount: number, currencyCode: string) => {
    const cur = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES.find(c => c.code === 'USD');
    const symbol = cur ? cur.symbol : '$';
    return symbol + Math.abs(amount).toFixed(2);
  };

  // Monitor container width to support responsive redrawing
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      // Ensure we have a valid width and avoid infinite loops
      if (width > 0) {
        setDimensions({ width, height: 220 });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Redraw canvas whenever dimensions or data changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;

    // Set high-DPI canvas backing store
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const colors = [
      '#6366f1', '#10b981', '#fbbf24', '#f43f5e', '#8b5cf6', '#ec4899', 
      '#14b8a6', '#f97316', '#3b82f6', '#06b6d4', '#a855f7'
    ];

    const total = data.reduce((sum, item) => sum + item[1], 0);

    if (total === 0 || data.length === 0) {
      ctx.fillStyle = '#71717a';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No expense data', width / 2, height / 2);
      return;
    }

    const pad = 24;
    const chartW = width - pad * 2;
    const chartH = height - pad * 2 - 16;
    const barW = Math.min((chartW / data.length) * 0.6, 32);
    const maxVal = Math.max(...data.map(d => d[1]), 1);

    // Draw bars
    for (let i = 0; i < data.length; i++) {
      const [label, val] = data[i];
      const pct = val / total;
      const h = (val / maxVal) * chartH;
      const x = pad + (i / data.length) * chartW + (chartW / data.length - barW) / 2;
      const y = pad + chartH - h;

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      
      // Draw rounded rectangle for bar
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barW, h, Math.min(4, h));
      } else {
        // Fallback roundRect polyfill logic built-in
        ctx.moveTo(x + 2, y);
        ctx.lineTo(x + barW - 2, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + Math.min(2, h));
        ctx.lineTo(x + barW, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y + Math.min(2, h));
        ctx.quadraticCurveTo(x, y, x + 2, y);
      }
      ctx.fill();

      // Render category label below bar
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      const labelText = label.length > 8 ? label.slice(0, 6) + '…' : label;
      ctx.fillText(labelText, x + barW / 2, pad + chartH + 14);

      // Render percentage text above bar
      ctx.fillStyle = '#71717a';
      ctx.font = '9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText((pct * 100).toFixed(0) + '%', x + barW / 2, y - 6);
    }

    // Draw y-axis maximum label
    ctx.fillStyle = '#71717a';
    ctx.font = '9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(formatCurrency(maxVal, baseCurrency), pad, pad - 10);

  }, [dimensions, data, baseCurrency]);

  return (
    <div ref={containerRef} className="w-full relative min-h-[220px]">
      <canvas ref={canvasRef} className="block mx-auto rounded-lg" id="chartCategory" />
    </div>
  );
}

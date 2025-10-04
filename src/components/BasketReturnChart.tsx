import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

type Row = { date: string; basketReturn: number; indexReturn: number; dateObj?: number };

export function formatDateLabel(ts: number | string | undefined) {
  if (!ts) return '';
  const d = typeof ts === 'number' ? new Date(ts) : new Date(String(ts));
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function BasketReturnChart({ data }: { data: Row[] }) {
  const [mode, setMode] = useState<'daily' | 'cumulative'>('daily');

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Ensure rows sorted by date ascending. Use dateObj if present else parse date string.
    const rows = data
      .map((r) => ({
        ...r,
        _ts: r.dateObj ?? (() => {
          const d = new Date(r.date + 'T00:00:00Z');
          return isNaN(d.getTime()) ? 0 : d.getTime();
        })(),
      }))
      .sort((a, b) => a._ts - b._ts);

    if (mode === 'daily') {
      return rows.map((r) => ({
        date: formatDateLabel(r._ts),
        basket: Number((r.basketReturn || 0).toFixed(2)),
        index: Number((r.indexReturn || 0).toFixed(2)),
        _ts: r._ts,
      }));
    }

    // cumulative: iterate and sum
    let cumBasket = 0;
    let cumIndex = 0;
    return rows.map((r) => {
      cumBasket += r.basketReturn || 0;
      cumIndex += r.indexReturn || 0;
      return {
        date: formatDateLabel(r._ts),
        basket: Number(cumBasket.toFixed(2)),
        index: Number(cumIndex.toFixed(2)),
        _ts: r._ts,
      };
    });
  }, [data, mode]);

  return (
    <div style={{ width: '100%', height: 420 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button
          onClick={() => setMode(mode === 'daily' ? 'cumulative' : 'daily')}
          className="btn"
          aria-pressed={mode === 'cumulative'}
        >
          {mode === 'daily' ? 'Show cumulative' : 'Show daily'}
        </button>
      </div>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="_ts"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(ts) => formatDateLabel(Number(ts))}
            ticks={chartData.map((d) => d._ts)}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis unit="%" />
          <Tooltip formatter={(v: any) => `${v}%`} labelFormatter={(label) => formatDateLabel(Number(label))} />
          <Legend />
          <Line type="monotone" dataKey="basket" stroke="#7C3AED" dot={false} name="Portfolio (%)" strokeWidth={2} />
          <Line type="monotone" dataKey="index" stroke="#10B981" dot={false} name="Index (%)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

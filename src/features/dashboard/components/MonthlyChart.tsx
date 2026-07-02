"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { MonthlyItem, CategoryItem } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface MonthlyChartProps {
  data: MonthlyItem[];
  categories: CategoryItem[];
}

export function MonthlyChart({ data, categories }: MonthlyChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a1a1a',
        titleColor: '#9ca3af',
        bodyColor: '#ffffff',
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: '#ffffff08',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          },
          callback: function(value: any) {
            return (value / 1000).toFixed(0) + 'k';
          }
        }
      }
    }
  };

  const chartData = {
    labels: data.map(d => d.mes),
    datasets: [
      {
        fill: true,
        label: 'Receita',
        data: data.map(d => d.receita),
        borderColor: '#10b981',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          return gradient;
        },
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#131313',
        pointBorderWidth: 2,
      },
      {
        fill: true,
        label: 'Despesa',
        data: data.map(d => d.despesa),
        borderColor: '#f43f5e',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(244, 63, 94, 0.2)');
          gradient.addColorStop(1, 'rgba(244, 63, 94, 0)');
          return gradient;
        },
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointBackgroundColor: '#f43f5e',
        pointBorderColor: '#131313',
        pointBorderWidth: 2,
      },
    ],
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
      <div className="lg:col-span-2 rounded-3xl p-5" style={{ background: "#1e1e1e" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-white">Desempenho Mensal</h2>
            <p className="text-xs text-gray-500 mt-0.5">Receita vs Despesa — 2026</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block" /> Receita
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block opacity-70" /> Despesa
            </span>
          </div>
        </div>
        <div style={{ height: 220, width: "100%" }}>
          <Line options={options as any} data={chartData} />
        </div>
      </div>

      <div className="rounded-3xl p-5" style={{ background: "#1e1e1e" }}>
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-white">Receita por Categoria</h2>
          <p className="text-xs text-gray-500 mt-0.5">Distribuição</p>
        </div>
        <div className="flex flex-col gap-5">
          {categories.map((cat) => (
            <div key={cat.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-300">{cat.label}</span>
                <span className="text-xs font-semibold text-white">{cat.value}</span>
              </div>
              <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "#2a2a2a" }}>
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                  style={{ width: `${cat.pct}%`, background: cat.color }}
                />
              </div>
              <p className="text-[10px] text-gray-600 mt-1">{cat.pct}% do total</p>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-sm text-gray-500 text-center mt-8">
              Sem dados no mês atual
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

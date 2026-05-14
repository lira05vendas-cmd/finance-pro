import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "../lib/utils";

const CHART_COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#6366f1",
  "#14b8a6",
  "#ec4899",
];

function EmptyChartMessage({ message = "Ainda não há dados para exibir." }) {
  return (
    <div className="flex h-[350px] w-full items-center justify-center rounded-2xl border border-dashed border-border bg-card/40">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-md">
      {label && (
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          {label}
        </p>
      )}

      <div className="space-y-1">
        {payload.map((entry) => (
          <p
            key={`${entry.name}-${entry.value}`}
            className="text-sm font-bold"
            style={{ color: entry.color }}
          >
            {entry.name}: {formatCurrency(Number(entry.value || 0))}
          </p>
        ))}
      </div>
    </div>
  );
}

function formatYAxisValue(value) {
  const amount = Number(value || 0);

  if (amount >= 1000) {
    return `R$${(amount / 1000).toFixed(1)}k`;
  }

  return `R$${amount}`;
}

export function MonthlyChart({ data = [] }) {
  const hasData = data.some(
    (item) => Number(item.entradas || 0) > 0 || Number(item.saídas || 0) > 0
  );

  if (!hasData) {
    return <EmptyChartMessage message="Adicione entradas e gastos para ver o gráfico mensal." />;
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="monthlyIncomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="monthlyExpenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="currentColor"
            strokeDasharray="3 3"
            className="text-border"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            stroke="currentColor"
            className="text-muted-foreground"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="currentColor"
            className="text-muted-foreground"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxisValue}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="entradas"
            name="Entradas"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#monthlyIncomeGradient)"
            fillOpacity={1}
            activeDot={{ r: 6 }}
          />

          <Area
            type="monotone"
            dataKey="saídas"
            name="Saídas"
            stroke="#ef4444"
            strokeWidth={3}
            fill="url(#monthlyExpenseGradient)"
            fillOpacity={1}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryChart({ data = [] }) {
  const filteredData = data.filter((item) => Number(item.value || 0) > 0);

  if (!filteredData.length) {
    return <EmptyChartMessage message="Adicione gastos por categoria para ver este gráfico." />;
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={78}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`${entry.name}-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
import React from 'react';
import { Wallet, TrendingUp, TrendingDown, ListChecks } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

const Card = ({
  title,
  amount,
  icon: Icon,
  iconColor,
  iconBackground,
  circleBackground,
  trend,
  isCurrency = true,
}) => {
  const formattedAmount = isCurrency ? formatCurrency(amount) : amount;

  return (
    <div className="bg-card p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div
        className={cn(
          'absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500',
          circleBackground
        )}
      />

      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-2xl', iconBackground)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>

        {trend && (
          <span
            className={cn(
              'text-xs font-medium px-2.5 py-1 rounded-full',
              trend > 0
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-rose-500/10 text-rose-500'
            )}
          >
            {trend > 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium text-muted-foreground mb-1">
        {title}
      </h3>

      <p className="text-2xl font-bold tracking-tight">
        {formattedAmount}
      </p>
    </div>
  );
};

export default function SummaryCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        title="Saldo Total"
        amount={stats.balance}
        icon={Wallet}
        iconColor="text-zinc-900"
        iconBackground="bg-zinc-100"
        circleBackground="bg-zinc-500"
      />

      <Card
        title="Total Entradas"
        amount={stats.totalIncomes}
        icon={TrendingUp}
        iconColor="text-emerald-500"
        iconBackground="bg-emerald-500/10"
        circleBackground="bg-emerald-500"
        trend={12}
      />

      <Card
        title="Total Saídas"
        amount={stats.totalExpenses}
        icon={TrendingDown}
        iconColor="text-rose-500"
        iconBackground="bg-rose-500/10"
        circleBackground="bg-rose-500"
        trend={-5}
      />

      <Card
        title="Total de Transações"
        amount={stats.totalTransactions}
        icon={ListChecks}
        iconColor="text-blue-500"
        iconBackground="bg-blue-500/10"
        circleBackground="bg-blue-500"
        isCurrency={false}
      />
    </div>
  );
}
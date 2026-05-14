import React, { useMemo, useState } from "react";
import {
  Download,
  Filter,
  Share2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { MonthlyChart, CategoryChart } from "../components/Charts";
import { useFinance } from "../hooks/useFinance";
import { categories, formatCurrency } from "../lib/utils";

const toCsvValue = (value) =>
  `"${String(value ?? "").replaceAll('"', '""')}"`;

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);

  anchor.click();

  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { transactions, monthlyData, categoryData, stats } = useFinance();

  const [showFilters, setShowFilters] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("Todas");

  const [typeFilter, setTypeFilter] = useState("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesCategory =
        categoryFilter === "Todas" ||
        transaction.category === categoryFilter;

      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;

      return matchesCategory && matchesType;
    });
  }, [transactions, categoryFilter, typeFilter]);

  const filteredCategoryData = useMemo(() => {
    const categoriesMap = {};

    filteredTransactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        categoriesMap[transaction.category] =
          (categoriesMap[transaction.category] || 0) +
          Number(transaction.amount);
      });

    return Object.entries(categoriesMap)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const activeMonths = useMemo(() => {
    return monthlyData.filter(
      (month) => month.entradas > 0 || month.saídas > 0
    ).length;
  }, [monthlyData]);

  const totalMonths = activeMonths || 1;

  const averageIncome = stats.totalIncomes / totalMonths;

  const averageExpense = stats.totalExpenses / totalMonths;

  const totalExpenses =
    filteredCategoryData.reduce(
      (total, item) => total + item.value,
      0
    ) || stats.totalExpenses;

  const biggestExpenseCategory =
    [...(filteredCategoryData.length
      ? filteredCategoryData
      : categoryData)]
      .sort((a, b) => b.value - a.value)[0];

  const exportCsv = () => {
    const header = [
      "Data",
      "Tipo",
      "Descrição",
      "Categoria",
      "Valor",
    ];

    const rows = filteredTransactions.map((transaction) => [
      transaction.date,
      transaction.type === "income" ? "Entrada" : "Saída",
      transaction.description,
      transaction.category,
      transaction.amount,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map(toCsvValue).join(";"))
      .join("\n");

    downloadFile(
      csv,
      "financepro-relatorio.csv",
      "text/csv;charset=utf-8"
    );
  };

  const printPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Relatórios Detalhados
          </h1>

          <p className="mt-1 text-muted-foreground">
            Analise seus dados financeiros em profundidade.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-2xl border border-border bg-secondary px-5 py-3 font-bold text-foreground transition-all hover:bg-muted"
          >
            <Share2 className="h-5 w-5" />
            Exportar
          </button>

          <button
            onClick={printPdf}
            className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="h-5 w-5" />
            PDF
          </button>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-emerald-500/10 bg-emerald-500/5 p-6">
          <div className="mb-3 flex items-center gap-2 text-emerald-500">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Entradas
            </span>
          </div>

          <p className="text-3xl font-black">
            {formatCurrency(stats.totalIncomes)}
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Média mensal: {formatCurrency(averageIncome)}
          </p>
        </div>

        <div className="rounded-[2rem] border border-rose-500/10 bg-rose-500/5 p-6">
          <div className="mb-3 flex items-center gap-2 text-rose-500">
            <TrendingDown className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Saídas
            </span>
          </div>

          <p className="text-3xl font-black">
            {formatCurrency(stats.totalExpenses)}
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Média mensal: {formatCurrency(averageExpense)}
          </p>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Maior categoria de gasto
          </p>

          <p className="text-2xl font-black">
            {biggestExpenseCategory?.name || "Sem dados"}
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {biggestExpenseCategory
              ? formatCurrency(biggestExpenseCategory.value)
              : "Adicione transações"}
          </p>
        </div>
      </div>

      {/* FILTROS */}
      {showFilters && (
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:flex-row">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-border bg-secondary/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Todas">Todas as categorias</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.id}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-border bg-secondary/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Entradas e saídas</option>
            <option value="income">Apenas entradas</option>
            <option value="expense">Apenas saídas</option>
          </select>
        </div>
      )}

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">
                Performance Mensal
              </h3>

              <p className="text-sm text-muted-foreground">
                Comparativo de entradas e saídas
              </p>
            </div>
          </div>

          <MonthlyChart data={monthlyData} />
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">
                Distribuição de Gastos
              </h3>

              <p className="text-sm text-muted-foreground">
                Percentual por categoria
              </p>
            </div>

            <button
              onClick={() =>
                setShowFilters((current) => !current)
              }
              className="rounded-lg border border-border bg-secondary p-2 transition-all hover:bg-muted"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>

          <CategoryChart
            data={
              filteredCategoryData.length
                ? filteredCategoryData
                : categoryData
            }
          />

          <div className="custom-scrollbar mt-8 max-h-[160px] space-y-4 overflow-y-auto pr-2">
            {(filteredCategoryData.length
              ? filteredCategoryData
              : categoryData
            )
              .sort((a, b) => b.value - a.value)
              .map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />

                    <span className="text-sm font-medium">
                      {category.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold">
                      {formatCurrency(category.value)}
                    </span>

                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-muted-foreground">
                      {Math.round(
                        (category.value / totalExpenses) * 100
                      ) || 0}
                      %
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
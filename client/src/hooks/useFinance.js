import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "finance_data";

function loadTransactions() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) return [];

    const parsedData = JSON.parse(savedData);

    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error("Erro ao carregar transações:", error);
    return [];
  }
}

function saveTransactions(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Erro ao salvar transações:", error);
  }
}

function parseAmount(amount) {
  const value = Number(amount);
  return Number.isNaN(value) ? 0 : value;
}

function getTransactionDate(date) {
  const transactionDate = new Date(date);

  if (Number.isNaN(transactionDate.getTime())) {
    return new Date();
  }

  return transactionDate;
}

function isSameMonthAndYear(date, month, year) {
  const transactionDate = getTransactionDate(date);

  return (
    transactionDate.getMonth() === month &&
    transactionDate.getFullYear() === year
  );
}

function calculateTotals(transactions) {
  const totalIncomes = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + parseAmount(transaction.amount),
      0
    );

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + parseAmount(transaction.amount),
      0
    );

  return {
    totalIncomes,
    totalExpenses,
    balance: totalIncomes - totalExpenses,
    totalTransactions: transactions.length,
  };
}

export function useFinance() {
  const [transactions, setTransactions] = useState(loadTransactions);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      amount: parseAmount(transaction.amount),
      date: transaction.date || new Date().toISOString(),
    };

    setTransactions((currentTransactions) => [
      newTransaction,
      ...currentTransactions,
    ]);
  };

  const deleteTransaction = (id) => {
    const shouldDelete = window.confirm(
      "Tem certeza que deseja excluir esta transação?"
    );

    if (!shouldDelete) return;

    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id)
    );
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? {
              ...updatedTransaction,
              amount: parseAmount(updatedTransaction.amount),
            }
          : transaction
      )
    );
  };

  // Cards principais: mostram apenas o mês atual.
  // As transações antigas continuam salvas no histórico.
  const stats = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const currentMonthTransactions = transactions.filter((transaction) =>
      isSameMonthAndYear(transaction.date, currentMonth, currentYear)
    );

    const currentMonthTotals = calculateTotals(currentMonthTransactions);

    return {
      ...currentMonthTotals,
      profit: currentMonthTotals.balance,
    };
  }, [transactions]);

  // Relatório dos últimos 6 meses.
  const monthlyData = useMemo(() => {
    const months = [];

    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date();
      date.setMonth(date.getMonth() - index);

      const month = date.getMonth();
      const year = date.getFullYear();

      const monthTransactions = transactions.filter((transaction) =>
        isSameMonthAndYear(transaction.date, month, year)
      );

      const totals = calculateTotals(monthTransactions);

      months.push({
        id: `${year}-${String(month + 1).padStart(2, "0")}`,
        name: date.toLocaleString("pt-BR", { month: "short" }),
        entradas: totals.totalIncomes,
        saídas: totals.totalExpenses,
        saldo: totals.balance,
        transações: totals.totalTransactions,
      });
    }

    return months;
  }, [transactions]);

  // Gastos por categoria.
  const categoryData = useMemo(() => {
    const categories = {};

    transactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        const category = transaction.category || "Outros";

        categories[category] =
          (categories[category] || 0) + parseAmount(transaction.amount);
      });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    stats,
    monthlyData,
    categoryData,
  };
}
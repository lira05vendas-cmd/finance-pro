import React, { useState } from 'react';
import { Link } from 'wouter';
import { Plus, Filter, Search, Download, Calendar } from 'lucide-react';
import SummaryCards from '../components/SummaryCards';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { MonthlyChart, CategoryChart } from '../components/Charts';
import { useFinance } from '../hooks/useFinance';

export default function Dashboard() {
  const { transactions, stats, monthlyData, categoryData, addTransaction, deleteTransaction, updateTransaction } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Get last 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Painel Financeiro</h1>
          <p className="text-muted-foreground mt-1">Olá, aqui está um resumo do seu desempenho este mês.</p>
        </div>
        <button 
          onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          Nova Transação
        </button>
      </div>

      <SummaryCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold">Fluxo de Caixa</h3>
                <p className="text-sm text-muted-foreground">Entradas vs Saídas (Últimos 6 meses)</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Entradas
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 text-xs font-bold">
                  <div className="w-2 h-2 rounded-full bg-rose-500" /> Saídas
                </div>
              </div>
            </div>
            <MonthlyChart data={monthlyData} />
          </div>

          <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Transações Recentes</h3>
              <Link href="/transactions"><a className="text-sm font-bold text-primary hover:underline">Ver todas</a></Link>
            </div>
            <TransactionList 
              transactions={recentTransactions} 
              onDelete={deleteTransaction}
              onEdit={(transaction) => { setEditingTransaction(transaction); setIsFormOpen(true); }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm">
            <h3 className="text-xl font-bold mb-2">Gastos por Categoria</h3>
            <p className="text-sm text-muted-foreground mb-6">Onde seu dinheiro está indo</p>
            <CategoryChart data={categoryData} />
            
            <div className="mt-6 space-y-4">
              {categoryData.slice(0, 4).map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'][i] }} />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <span className="text-sm font-bold">
                    {Math.round((cat.value / stats.totalExpenses) * 100) || 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary p-8 rounded-[2rem] border border-primary/20 shadow-xl shadow-primary/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <h3 className="text-xl font-bold text-primary-foreground mb-4 relative z-10">Dica </h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed relative z-10">
              {stats.totalIncomes > 0
                ? `Você usou ${Math.round((stats.totalExpenses / stats.totalIncomes) * 100)}% das suas entradas. Tente manter esse número controlado para sobrar dinheiro no fim do mês.`
                : 'Adicione uma entrada e algumas despesas para receber uma dica financeira personalizada.'}
            </p>
            <Link href="/reports"><a className="block text-center mt-6 w-full py-3 bg-white text-primary font-bold rounded-xl text-sm relative z-10">Ver Relatórios</a></Link>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <TransactionForm 
          onSubmit={(transaction) => { editingTransaction ? updateTransaction(transaction) : addTransaction(transaction); setEditingTransaction(null); }} 
          onClose={() => { setIsFormOpen(false); setEditingTransaction(null); }}
          initialTransaction={editingTransaction} 
        />
      )}
    </div>
  );
}

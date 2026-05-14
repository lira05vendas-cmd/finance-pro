import React, { useState, useMemo } from 'react';
import { Search, Plus, Calendar } from 'lucide-react';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { useFinance } from '../hooks/useFinance';
import { cn, categories } from '../lib/utils';

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('Todas');

  const openNewTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const openEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleSubmit = (transaction) => {
    if (editingTransaction) {
      updateTransaction(transaction);
    } else {
      addTransaction(transaction);
    }
    setEditingTransaction(null);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'Todas' || t.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchTerm, filterType, filterCategory]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Todas as Transações</h1>
          <p className="text-muted-foreground mt-1">Gerencie seu histórico financeiro completo.</p>
        </div>
        <button 
          onClick={openNewTransaction}
          className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          Nova Transação
        </button>
      </div>

      <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col xl:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar por descrição ou categoria..." 
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full xl:w-56 px-4 py-3.5 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="Todas">Todas as categorias</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.id}</option>
          ))}
        </select>

        <div className="flex items-center gap-2 p-1.5 bg-secondary/50 rounded-xl border border-border w-full xl:w-auto">
          <button 
            onClick={() => setFilterType('all')}
            className={cn(
              "flex-1 xl:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all",
              filterType === 'all' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilterType('income')}
            className={cn(
              "flex-1 xl:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all",
              filterType === 'income' ? "bg-emerald-500/10 text-emerald-500 shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Entradas
          </button>
          <button 
            onClick={() => setFilterType('expense')}
            className={cn(
              "flex-1 xl:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all",
              filterType === 'expense' ? "bg-rose-500/10 text-rose-500 shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Saídas
          </button>
        </div>
      </div>

      <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm min-h-[400px]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold">Histórico</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Calendar className="w-4 h-4" />
            <span>{filteredTransactions.length} transações</span>
          </div>
        </div>
        
        <TransactionList 
          transactions={filteredTransactions} 
          onDelete={deleteTransaction}
          onEdit={openEditTransaction}
        />
      </div>

      {isFormOpen && (
        <TransactionForm 
          onSubmit={handleSubmit} 
          onClose={() => { setIsFormOpen(false); setEditingTransaction(null); }}
          initialTransaction={editingTransaction}
        />
      )}
    </div>
  );
}

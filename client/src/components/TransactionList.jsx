import React from 'react';
import { Trash2, Pencil, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import { formatCurrency, formatDate, cn, categories } from '../lib/utils';

export default function TransactionList({ transactions, onDelete, onEdit }) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
          <Tag className="w-10 h-10 opacity-20" />
        </div>
        <p className="text-lg font-medium">Nenhuma transação encontrada</p>
        <p className="text-sm">Comece adicionando uma nova entrada ou saída.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((t) => {
        const category = categories.find(c => c.id === t.category) || categories[9];
        return (
          <div 
            key={t.id} 
            className="group flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                t.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              )}>
                {t.type === 'income' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
              </div>
              
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{t.description}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-medium text-muted-foreground">{category.id}</span>
                  <span className="text-[10px] text-muted-foreground/40">•</span>
                  <span className="text-xs text-muted-foreground/60">{formatDate(t.date)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="text-right">
                <p className={cn(
                  "font-bold text-lg",
                  t.type === 'income' ? "text-emerald-500" : "text-rose-500"
                )}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </p>
              </div>
              
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                {onEdit && (
                  <button 
                    onClick={() => onEdit(t)}
                    className="p-2.5 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300"
                    title="Editar"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => onDelete(t.id)}
                  className="p-2.5 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-300"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

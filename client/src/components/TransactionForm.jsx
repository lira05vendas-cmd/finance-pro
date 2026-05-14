import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Settings,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import { categories as defaultCategories, cn } from '../lib/utils';

const CATEGORY_STORAGE_KEY = 'finance_categories';

function loadCategories() {
  try {
    const savedCategories = localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (!savedCategories) return defaultCategories;

    const parsedCategories = JSON.parse(savedCategories);
    return Array.isArray(parsedCategories) ? parsedCategories : defaultCategories;
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    return defaultCategories;
  }
}

function saveCategories(categories) {
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
}

export default function TransactionForm({
  onSubmit,
  onClose,
  initialTransaction,
}) {
  const [categories, setCategories] = useState(loadCategories);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const [formData, setFormData] = useState(() => ({
    description: initialTransaction?.description || '',
    amount: initialTransaction?.amount || '',
    type: initialTransaction?.type || 'expense',
    category: initialTransaction?.category || 'Outros',
    date: initialTransaction?.date
      ? String(initialTransaction.date).split('T')[0]
      : new Date().toISOString().split('T')[0],
  }));

  const isEditing = Boolean(initialTransaction?.id);

  const handleAddCategory = () => {
    const categoryName = newCategory.trim();
    if (!categoryName) return;

    const categoryAlreadyExists = categories.some(
      (category) => category.id.toLowerCase() === categoryName.toLowerCase()
    );

    if (categoryAlreadyExists) {
      alert('Essa categoria já existe.');
      return;
    }

    const updatedCategories = [
      ...categories,
      {
        id: categoryName,
        icon: 'Plus',
        color: '#6b7280',
      },
    ];

    setCategories(updatedCategories);
    saveCategories(updatedCategories);

    setFormData((currentData) => ({
      ...currentData,
      category: categoryName,
    }));

    setNewCategory('');
  };

  const handleRemoveCategory = (categoryId) => {
    if (categoryId === 'Outros') {
      alert('A categoria Outros não pode ser removida.');
      return;
    }

    const shouldRemove = window.confirm(
      `Deseja remover a categoria "${categoryId}"?`
    );

    if (!shouldRemove) return;

    const updatedCategories = categories.filter(
      (category) => category.id !== categoryId
    );

    setCategories(updatedCategories);
    saveCategories(updatedCategories);

    if (formData.category === categoryId) {
      setFormData((currentData) => ({
        ...currentData,
        category: 'Outros',
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.description || !formData.amount) return;

    onSubmit({
      ...initialTransaction,
      ...formData,
      amount: parseFloat(formData.amount),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-[2.5rem] border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">
              {isEditing ? 'Editar Transação' : 'Nova Transação'}
            </h3>

            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={cn(
                  'flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all',
                  formData.type === 'income'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                    : 'border-border hover:border-muted-foreground'
                )}
              >
                <ArrowUpCircle className="w-5 h-5" />
                <span className="font-bold">Entrada</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={cn(
                  'flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all',
                  formData.type === 'expense'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                    : 'border-border hover:border-muted-foreground'
                )}
              >
                <ArrowDownCircle className="w-5 h-5" />
                <span className="font-bold">Saída</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">
                Descrição
              </label>

              <input
                required
                type="text"
                placeholder="Ex: Aluguel, Salário, Mercado..."
                className="w-full p-4 rounded-2xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                value={formData.description}
                onChange={(event) =>
                  setFormData({ ...formData, description: event.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">
                  Valor
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                    R$
                  </span>

                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                    value={formData.amount}
                    onChange={(event) =>
                      setFormData({ ...formData, amount: event.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">
                  Data
                </label>

                <input
                  required
                  type="date"
                  className="w-full p-4 rounded-2xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.date}
                  onChange={(event) =>
                    setFormData({ ...formData, date: event.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground ml-1">
                  Categoria
                </label>

                <button
                  type="button"
                  onClick={() => setShowCategoryManager(!showCategoryManager)}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Gerenciar
                </button>
              </div>

              <select
                className="w-full p-4 rounded-2xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                value={formData.category}
                onChange={(event) =>
                  setFormData({ ...formData, category: event.target.value })
                }
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.id}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nova categoria"
                  className="flex-1 p-4 rounded-2xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                />

                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-5 rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {showCategoryManager && (
                <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2">
                  <p className="text-sm font-semibold">Categorias cadastradas</p>

                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between rounded-xl bg-background border border-border px-4 py-3"
                      >
                        <span className="text-sm font-medium">{category.id}</span>

                        {category.id !== 'Outros' && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(category.id)}
                            className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
            >
              {isEditing ? 'Salvar Alterações' : 'Adicionar Transação'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
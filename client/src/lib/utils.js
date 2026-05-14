import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

export const categories = [
  { id: 'Alimentação', icon: 'Utensils', color: '#10b981' },
  { id: 'Transporte', icon: 'Car', color: '#3b82f6' },
  { id: 'Compras', icon: 'ShoppingBag', color: '#f59e0b' },
  { id: 'Casa', icon: 'Home', color: '#8b5cf6' },
  { id: 'Saúde', icon: 'Heart', color: '#ef4444' },
  { id: 'Trabalho', icon: 'Briefcase', color: '#6366f1' },
  { id: 'Lazer', icon: 'Smile', color: '#ec4899' },
  { id: 'Assinaturas', icon: 'CreditCard', color: '#06b6d4' },
  { id: 'Investimentos', icon: 'TrendingUp', color: '#14b8a6' },
  { id: 'Outros', icon: 'Plus', color: '#6b7280' },
];

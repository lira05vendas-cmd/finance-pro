import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Settings, 
  Menu, 
  X,
  CreditCard,
  PlusCircle,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocation, Link } from 'wouter';
import { useAppSettings } from '../contexts/AppSettings';

const SidebarItem = ({ icon: Icon, label, href, active, onClick }) => (
  <Link href={href}>
    <a 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon className={cn("w-5 h-5", active ? "text-primary-foreground" : "group-hover:scale-110 transition-transform")} />
      <span className="font-medium">{label}</span>
    </a>
  </Link>
);

export default function Layout({ children }) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profileName } = useAppSettings();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: ArrowLeftRight, label: 'Transações', href: '/transactions' },
    { icon: PieChart, label: 'Relatórios', href: '/reports' },
    { icon: Settings, label: 'Configurações', href: '/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 lg:static lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <TrendingUp className="text-primary-foreground w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">FinancePro</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.href}
                {...item}
                active={location === item.href}
                onClick={() => setIsSidebarOpen(false)}
              />
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-border">
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Conta Premium</p>
              <p className="text-sm font-medium">{profileName}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold capitalize">
              {location === '/' ? 'Visão Geral' : location.substring(1)}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Bem-vindo de volta</span>
              <span className="text-sm font-medium">{profileName}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
              <span className="font-bold text-primary">
  {profileName ? profileName.charAt(0).toUpperCase() : "M"}
            </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}

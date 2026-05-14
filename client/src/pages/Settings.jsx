import React, { useEffect, useState } from 'react';
import {
  User,
  Shield,
  Database,
  Moon,
  Sun,
  Trash2,
  Github,
  Save,
} from 'lucide-react';

import { useAppSettings } from '../contexts/AppSettings';
import { cn } from '../lib/utils';

const SettingItem = ({ icon: Icon, title, description, action }) => (
  <div className="flex items-center justify-between gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <Icon className="w-6 h-6" />
      </div>

      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>

    {action}
  </div>
);

export default function Settings() {
  const { theme, toggleTheme, profileName, setProfileName } = useAppSettings();
  const [nameInput, setNameInput] = useState(profileName);

  useEffect(() => {
    setNameInput(profileName);
  }, [profileName]);

  const saveProfileName = () => {
    const cleanName = nameInput.trim();

    if (!cleanName) {
      alert('Digite um nome válido.');
      return;
    }

    setProfileName(cleanName);
    localStorage.setItem('profileName', cleanName);
  };

  const clearData = () => {
    const shouldClear = window.confirm(
      'TEM CERTEZA? Isso excluirá todas as suas transações permanentemente.'
    );

    if (!shouldClear) return;

    localStorage.removeItem('finance_data');
    window.location.reload();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Personalize sua experiência no FinancePro.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Preferências
          </h3>

          <div className="grid gap-4">
            <SettingItem
              icon={User}
              title="Perfil"
              description={`Nome atual: ${profileName}`}
              action={
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(event) => setNameInput(event.target.value)}
                    className="w-40 px-4 py-2 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-medium"
                    placeholder="Seu nome"
                  />

                  <button
                    type="button"
                    onClick={saveProfileName}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </button>
                </div>
              }
            />

            <SettingItem
              icon={Moon}
              title="Aparência"
              description="Alternar entre modo claro e escuro"
              action={
                <div className="flex bg-secondary p-1 rounded-lg">
                  <button
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    className={cn(
                      'p-2 rounded-md transition-all',
                      theme === 'dark'
                        ? 'bg-card shadow-sm'
                        : 'opacity-40 hover:opacity-100'
                    )}
                    title="Modo escuro"
                  >
                    <Moon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => theme !== 'light' && toggleTheme()}
                    className={cn(
                      'p-2 rounded-md transition-all',
                      theme === 'light'
                        ? 'bg-card shadow-sm'
                        : 'opacity-40 hover:opacity-100'
                    )}
                    title="Modo claro"
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                </div>
              }
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Dados
          </h3>

          <div className="grid gap-4">
            <SettingItem
              icon={Database}
              title="Backup local"
              description="Os dados são salvos apenas no seu dispositivo"
              action={
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                  Ativo
                </span>
              }
            />

            <SettingItem
              icon={Trash2}
              title="Limpar Dados"
              description="Excluir todas as transações permanentemente"
              action={
                <button
                  onClick={clearData}
                  className="px-4 py-2 bg-rose-500/10 text-rose-500 rounded-xl font-bold hover:bg-rose-500 hover:text-white transition-all text-sm"
                >
                  Limpar Agora
                </button>
              }
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Sobre
          </h3>

          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-border relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl mb-4">
                <Shield className="text-primary-foreground w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold mb-2">FinancePro v1.0.0</h3>

              <p className="text-sm text-muted-foreground max-w-md mb-6">
                Desenvolvido para oferecer controle total sobre suas finanças
                com privacidade absoluta.
              </p>

              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Github
                </a>

                <button
                  onClick={() =>
                    alert('Seus dados ficam somente no seu dispositivo.')
                  }
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Política de Privacidade
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
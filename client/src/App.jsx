import React from "react";
import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { Toaster } from "sonner";
import { AppSettingsProvider, useAppSettings } from "./contexts/AppSettings";

function AppContent() {
  const { theme } = useAppSettings();

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Router hook={useHashLocation}>
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/reports" component={Reports} />
            <Route path="/settings" component={Settings} />
            <Route>
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-muted-foreground">Página não encontrada</p>
              </div>
            </Route>
          </Switch>
        </Layout>
      </Router>

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <AppSettingsProvider>
      <AppContent />
    </AppSettingsProvider>
  );
}

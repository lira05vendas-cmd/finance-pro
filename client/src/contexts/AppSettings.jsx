import { createContext, useContext, useEffect, useState } from "react";

const AppSettingsContext = createContext(null);

const DEFAULT_PROFILE_NAME = "Marky";

export function AppSettingsProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem("profileName") || DEFAULT_PROFILE_NAME;
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("profileName", profileName);
  }, [profileName]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  const updateProfileName = (newName) => {
    const cleanName = newName.trim();

    if (!cleanName) return;

    setProfileName(cleanName);
  };

  return (
    <AppSettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        profileName,
        setProfileName: updateProfileName,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error(
      "useAppSettings deve ser usado dentro de AppSettingsProvider"
    );
  }

  return context;
}
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

export const SettingsView = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as Theme;
      if (storedTheme) {
        return storedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = (isDark: boolean) => {
    setTheme(isDark ? "dark" : "light");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
        <CardDescription>Ajuste as preferências da sua conta.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            {theme === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-blue-400" />}
            <Label htmlFor="theme-switch" className="font-medium">
              Tema Escuro
            </Label>
          </div>
          <Switch
            id="theme-switch"
            checked={theme === "dark"}
            onCheckedChange={handleThemeChange}
          />
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg opacity-50 cursor-not-allowed">
           <Label htmlFor="notification-switch" className="font-medium">
              Notificações por Email
            </Label>
          <Switch id="notification-switch" disabled />
        </div>
      </CardContent>
    </Card>
  );
};

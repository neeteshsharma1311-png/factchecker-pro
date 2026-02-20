import { Palette } from "lucide-react";
import { useTheme, themes } from "./ThemeProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg border border-border hover:border-primary/50">
          <Palette className="h-4 w-4 text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-card border-border" align="end">
        <p className="text-xs text-muted-foreground px-2 pb-2 font-mono uppercase tracking-wider">Theme</p>
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              theme === t.id ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <span className="h-3 w-3 rounded-full border border-border" style={{ background: t.color }} />
            {t.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default ThemeSwitcher;

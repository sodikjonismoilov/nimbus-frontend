import {useEffect, useState} from "react";
import {applyTheme, detectInitialTheme, type ThemeMode} from "@/lib/theme.ts";
import {Button} from "@/components/ui/button.tsx";
import {Moon, Sun} from "lucide-react";


export default function ThemeToggle() {
    const [mode, setMode] = useState<ThemeMode>(() => detectInitialTheme());

    useEffect(() => {
        applyTheme(mode);
    }, [mode]);

    return (
        <Button
            variant="outline"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setMode(prev => (prev === "dark" ? "light" : "dark"))}
            >
            {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
    );
}
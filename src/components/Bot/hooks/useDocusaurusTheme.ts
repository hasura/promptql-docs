import { useState, useEffect } from "react";

export const useDocusaurusTheme = (theme?: "light" | "dark" | "auto"): "light" | "dark" => {
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "light" || theme === "dark") {
      setResolvedTheme(theme);
      return;
    }

    // Auto-detect theme
    const detectTheme = () => {
      // Check for Docusaurus theme
      const docusaurusTheme = document.documentElement.getAttribute("data-theme");
      if (docusaurusTheme === "dark") {
        setResolvedTheme("dark");
        return;
      }

      // Check for system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setResolvedTheme("dark");
        return;
      }

      setResolvedTheme("light");
    };

    detectTheme();

    // Listen for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", detectTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", detectTheme);
    };
  }, [theme]);

  return resolvedTheme;
};

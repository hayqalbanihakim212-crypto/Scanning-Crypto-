import {
  createContext,
  useContext,
  useEffect,
  useState,
  createElement,
} from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return createElement(
    ThemeContext.Provider,
    { value: { dark, setDark } },
    children,
  );
}

export const useTheme = () => useContext(ThemeContext);

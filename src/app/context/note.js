"use client"

import { createContext, useEffect, useState } from "react"

export const NotesContext = createContext(); 

export default function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [theme, setTheme] = useState("light");
  const [screenSize, setScreenSize] = useState(false)

useEffect(() => {
  const handleResize = () => {
    setScreenSize(window.innerWidth > 768);
  };

  handleResize();

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
    <NotesContext.Provider value={{ notes, setNotes, setTheme, theme, screenSize  }}>
      {children}
    </NotesContext.Provider>
  )
}

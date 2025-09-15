"use client"

import { createContext, useEffect, useState } from "react"

export const NotesContext = createContext(); 

export default function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [theme, setTheme] = useState("light");
  const [screenSize, setScreenSize] = useState(window.innerWidth > 768)

  useEffect(() => {
    window.addEventListener('resize', () => setScreenSize(window.innerWidth > 768))
  }, [])

  return (
    <NotesContext.Provider value={{ notes, setNotes, setTheme, theme, screenSize  }}>
      {children}
    </NotesContext.Provider>
  )
}

"use client"

import { createContext, useState } from "react"

export const NotesContext = createContext(); 

export default function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [theme, setTheme] = useState("light");


  return (
    <NotesContext.Provider value={{ notes, setNotes, setTheme, theme  }}>
      {children}
    </NotesContext.Provider>
  )
}

"use client"
import { useContext } from "react";
import "./header.css"
import { NotesContext } from "@/src/app/context/note";
export default function Header() {
    const { theme } = useContext(NotesContext);  

  return (
    <div className="header-section">
      <img src={theme === "dark" ? "/img/logo-dark-mode.png" : "/img/logo-light-mode.png"} alt="logo" />
    </div>
  );
}
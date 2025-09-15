"use client"
import { useContext } from "react";
import "./header.css"
import { NotesContext } from "@/src/app/context/note";
export default function Header() {
    const { theme, screenSize } = useContext(NotesContext);  

  return (
    <>
      {screenSize ?
          <img src={theme === "dark" ? "/img/logo-dark-mode.png" : "/img/logo-light-mode.png"} alt="logo" />
        :
        <div className="header-section">
          <img src={theme === "dark" ? "/img/logo-dark-mode.png" : "/img/logo-light-mode.png"} alt="logo" />
        </div>
      }
     </>
  )
}

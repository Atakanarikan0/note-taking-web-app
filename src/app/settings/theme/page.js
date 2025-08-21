"use client"
import Header from "@/components/header"
import "./theme.css"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { NotesContext } from "../../context/note"

export default function Theme() {
  const { theme, setTheme} = useContext(NotesContext);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.classList.add(savedTheme);
  }, []);

  function handleThemeChange(newTheme) {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(newTheme);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }
  return (
    <>
      <Header theme={theme} />
      <div className="theme-container">
        <Link href="/settings">Settings</Link>
        <h2>Color Theme</h2>
        <p>Choose your color theme:</p>
        <div className="theme-list">
          <label className="theme-item" style={theme === "light" ? { background: "#F3F5F8" } : {}}>
            <img src="/img/sun-theme-icon.svg" alt="Sun Theme" />
            <div>
              <h6>Light Mode</h6>
              <span>Pick a clean and classic light theme</span>
            </div>
            <input type="radio" name="theme" checked={theme === "light"}
              onChange={() => handleThemeChange("light")}
            />
          </label>
          <label className="theme-item dark-mode" style={theme === "dark" ? { background: "#232530" } : {}}>
            <img src="/img/dark-mode-icon.svg" alt="Sun Theme" />
            <div>
              <h6>Dark Mode</h6>
              <span>Select a sleek and modern dark theme</span>
            </div>
            <input type="radio" name="theme" checked={theme === "dark"}
              onChange={() => handleThemeChange("dark")}
            />
          </label>
        </div>

      </div>
      <Navigation />
    </>
  )
}
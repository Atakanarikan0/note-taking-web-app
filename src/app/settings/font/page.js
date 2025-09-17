"use client"
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./fonts.css";

export default function FontTheme({ screenSize }) {
  const [font, setFont] = useState("sans-serif");

  useEffect(() => {
    const savedFont = localStorage.getItem("font") || "sans-serif";
    setFont(savedFont);
    document.body.style.fontFamily = savedFont;
  }, []);

  function handleFontChange(newFont) {
    document.body.style.fontFamily = newFont;
    setFont(newFont);
    localStorage.setItem("font", newFont);
    console.log(document.body.style.fontFamily);
  }


  const theme = document.body.classList.contains("dark");


  return (
    <>
      {screenSize ?
          <div className="font-container">
            <h2>Font Theme</h2>
            <p>Choose your font theme:</p>
            <div className="font-list">
              <label className="font-item" style={{
                background: font === "inter"
                  ? theme
                    ? "#232530"
                    : "#F3F5F8"
                  : "",
              }}>
                <img src="/img/sans-serif.svg" alt="Inter" />
                <div>
                  <h6>Inter </h6>
                  <span>Easy to read.</span>
                </div>
                <input type="radio" name="font" checked={font === "inter"}
                  onChange={() => handleFontChange("inter")}
                />
              </label>
              <label className="font-item" style={{
                background: font === "sans-serif"
                  ? theme
                    ? "#232530"
                    : "#F3F5F8"
                  : "",
              }}>
                <img src="/img/sans-serif.svg" alt="Sans-serif" />
                <div>
                  <h6>Sans-serif </h6>
                  <span>Clean and modern, easy to read.</span>
                </div>
                <input type="radio" name="font" checked={font === "sans-serif"}
                  onChange={() => handleFontChange("sans-serif")}
                />
              </label>
              <label className="font-item" style={{
                background: font === "serif"
                  ? theme
                    ? "#232530"
                    : "#F3F5F8"
                  : "",
              }}>
                <img src="/img/serif.svg" alt="Serif" />
                <div>
                  <h6>Serif</h6>
                  <span>Classic and elegant for a timeless feel.</span>
                </div>
                <input type="radio" name="font" checked={font === "serif"}
                  onChange={() => handleFontChange("serif")}
                />
              </label>
              <label className="font-item" style={{
                background: font === "Monospace"
                  ? theme
                    ? "#232530"
                    : "#F3F5F8"
                  : "",
              }}>
                <img src="/img/monospace.svg" alt="Monospace" />
                <div>
                  <h6>Monospace</h6>
                  <span>Code-like, great for a technical vibe.</span>
                </div>
                <input type="radio" name="font" checked={font === "Monospace"}
                  onChange={() => handleFontChange("Monospace")}
                />
              </label>
            </div>
          </div>
      
        :
        <>
          <Header />
          <div className="font-container">
            <Link href="/settings">Settings</Link>
            <h2>Font Theme</h2>
            <p>Choose your font theme:</p>
            <div className="font-list">
              <label className="font-item" style={{
                background: font === "inter"
                  ? theme
                    ? "#232530"
                    : "#F3F5F8"
                  : "",
              }}>
                <img src="/img/sans-serif.svg" alt="Inter" />
                <div>
                  <h6>Inter </h6>
                  <span>Easy to read.</span>
                </div>
                <input type="radio" name="font" checked={font === "inter"}
                  onChange={() => handleFontChange("inter")}
                />
              </label>
              <label className="font-item" style={{
                background: font === "sans-serif"
                  ? theme
                    ? "#232530"
                    : "#F3F5F8"
                  : "",
              }}>
                <img src="/img/sans-serif.svg" alt="Sans-serif" />
                <div>
                  <h6>Sans-serif </h6>
                  <span>Clean and modern, easy to read.</span>
                </div>
                <input type="radio" name="font" checked={font === "sans-serif"}
                  onChange={() => handleFontChange("sans-serif")}
                />
              </label>
              <label className="font-item" style={{
                background: font === "serif"
                  ? theme
                    ? "#232530"
                    : "#F3F5F8"
                  : "",
              }}>
                <img src="/img/serif.svg" alt="Serif" />
                <div>
                  <h6>Serif</h6>
                  <span>Classic and elegant for a timeless feel.</span>
                </div>
                <input type="radio" name="font" checked={font === "serif"}
                  onChange={() => handleFontChange("serif")}
                />
              </label>
              <label className="font-item" style={{
                background: font === "Monospace"
                  ? theme
                    ? "#232530"
                    : "#F3F5F8"
                  : "",
              }}>
                <img src="/img/monospace.svg" alt="Monospace" />
                <div>
                  <h6>Monospace</h6>
                  <span>Code-like, great for a technical vibe.</span>
                </div>
                <input type="radio" name="font" checked={font === "Monospace"}
                  onChange={() => handleFontChange("Monospace")}
                />
              </label>
            </div>
          </div>
          <Navigation />
        </>
      }

    </>
  )
}
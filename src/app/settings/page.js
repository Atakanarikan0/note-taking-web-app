"use client"
import "./settings.css"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { handleLogout } from "./logout"
import { useState } from "react"
import Theme from "./theme/page"
import FontTheme from "./font/page"
import Password from "./password/page"

export default function Settings({ screenSize }) {
  const [selectedSetting, setSelectedSetting] = useState("");
  return (
    <>
      {screenSize ?
      <>
        <div className="settings-container">
          <div className="settings-list">
            <button className={selectedSetting === "color" ? "active" : ""} onClick={() => setSelectedSetting("color")}><img src="/img/sun-icon.svg" alt="Color Theme" /> <h6>Color Theme</h6></button>
            <button className={selectedSetting === "font" ? "active" : ""} onClick={() => setSelectedSetting("font")}><img src="/img/font-type-icon.svg" alt="Font Theme" /> <h6>Font Theme</h6></button>
            <button className={selectedSetting === "password" ? "active" : ""} onClick={() => setSelectedSetting("password")}><img src="/img/change-password-icon.svg" alt="Change Password" /> <h6>Change Password</h6></button>
          </div>
          <button className="logout" onClick={handleLogout}><img src="/img/logout-icon.svg" alt="Logout" /> <h6>Logout</h6></button>
        </div>
        <>
        {selectedSetting === "color" && <Theme screenSize={screenSize} />}
        {selectedSetting === "font" && <FontTheme screenSize={screenSize} />}
        {selectedSetting === "password" && <Password screenSize={screenSize} />}
        </>
        </>
        :
        <>
          <Header />
          <div className="settings-container">
            <h2>Settings</h2>
            <div className="settings-list">
              <Link href="/settings/theme"><img src="/img/sun-icon.svg" alt="Color Theme" /> <h6>Color Theme</h6></Link>
              <Link href="/settings/font"><img src="/img/font-type-icon.svg" alt="Font Theme" /> <h6>Font Theme</h6></Link>
              <Link href="/settings/password"><img src="/img/change-password-icon.svg" alt="Change Password" /> <h6>Change Password</h6></Link>
            </div>
            <button className="logout" onClick={handleLogout}><img src="/img/logout-icon.svg" alt="Logout" /> <h6>Logout</h6></button>
          </div>
          <Navigation />
        </>
      }
    </>
  )
}
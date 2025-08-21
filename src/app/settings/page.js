"use client"
import "./settings.css"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { handleLogout } from "./logout"

export default function Settings() {

  return(
    <>
      <Header />
      <div className="settings-container">
        <h2>Settings</h2>
        <div className="settings-list">
          <Link href="/settings/theme"><img src="/img/sun-icon.svg" alt="Color Theme"/> <h6>Color Theme</h6></Link>
          <Link href="/settings/font"><img src="/img/font-type-icon.svg" alt="Font Theme"/> <h6>Font Theme</h6></Link>
          <Link href="/settings/password"><img src="/img/change-password-icon.svg" alt="Change Password"/> <h6>Change Password</h6></Link>
        </div>
        <button className="logout" onClick={handleLogout}><img src="/img/logout-icon.svg" alt="Logout"/> <h6>Logout</h6></button>
      </div>
      <Navigation />
    </>
  )
}
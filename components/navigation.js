"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import "./navigation.css"
import { useContext } from "react";
import { NotesContext } from "@/src/app/context/note";


export default function Navigation({ setShowSettings }) {
  const { screenSize } = useContext(NotesContext);
  const pathname = usePathname(); // aktif path'i al
  return (
    <>
      {screenSize ? 
      <DesktopNavigation setShowSettings={setShowSettings}/>
      :
      <div className="navigation-container">
      <Link href="/" className={pathname === "/" ? "active" : ""}>
        <img
          src="/img/home-icon-light.svg"
          alt="Main"
        />
        <span>Home</span>

      </Link>
      <hr />
      <Link href="/search" className={pathname === "/search" ? "active" : ""}>
        <img
          src="/img/search-icon-light.svg"
          alt="Search"
        />
        <span>Search</span>

      </Link>
      <hr />
      <Link href="/archived" className={pathname === "/archived" ? "active" : ""}>
        <img
          src="/img/archive-icon-light.svg"
          alt="Archive"
        />
        <span>Archived</span>
      </Link>
      <hr />
      <Link href="/tags" className={pathname === "/tags" ? "active" : ""}>
        <img
          src="/img/tag-icon-light.svg"
          alt="Tag"
        />
        <span>Tags</span>
      </Link>
      <hr />
      <Link href="/settings" className={pathname === "/settings" ? "active" : ""}>
        <img
          src="/img/setting-icon-light.svg"
          alt="Setting"
        />
        <span>Settings</span>
      </Link>
      </div>
      }
    
    </>

  )
}
function DesktopNavigation({setShowSettings}) {
  return (
    <>
      <div className="btn-group">
        <button onClick={() => setShowSettings(false)}><img
          src="/img/home-icon-light.svg"
          alt="Main"
        />
          <span>All Notes</span></button>
        <button>        <img
          src="/img/archive-icon-light.svg"
          alt="Archive"
        />
          <span>Archived Notes</span></button>
      </div>
    </>
  )
}

"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import "./navigation.css"

export default function Navigation() {
  const pathname = usePathname(); // aktif path'i al

  return (
    <div className="navigation-container">
      <Link href="/">
        <img 
          src="/img/home-icon-light.svg" 
          alt="Main" 
          className={pathname === "/" ? "active" : ""}
        />
      </Link>
      <Link href="/search">
        <img 
          src="/img/search-icon-light.svg" 
          alt="Search" 
          className={pathname === "/search" ? "active" : ""}
        />
      </Link>
      <Link href="/archived">
        <img 
          src="/img/archive-icon-light.svg" 
          alt="Archive" 
          className={pathname === "/archived" ? "active" : ""}
        />
      </Link>
      <Link href="/tags">
        <img 
          src="/img/tag-icon-light.svg" 
          alt="Tag" 
          className={pathname === "/tags" ? "active" : ""}
        />
      </Link>
      <Link href="/settings">
        <img 
          src="/img/setting-icon-light.svg" 
          alt="Setting" 
          className={pathname === "/settings" ? "active" : ""}
        />
      </Link>
    </div>
  )
}

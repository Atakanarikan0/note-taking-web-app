import Link from "next/link"
import "./navigation.css"

export default function Navigation() {
  return (
    <div className="navigation-container">
      <Link href="/"><img src="/img/home-icon-light.svg" alt="Main" /></Link>
      <Link href="/search"><img src="/img/search-icon-light.svg" alt="Search" /></Link>
      <Link href="/search"><img src="/img/archive-icon-light.svg" alt="Archive" /></Link>
      <Link href="/search"><img src="/img/tag-icon-light.svg" alt="Tag" /></Link>
      <Link href="/search"><img src="/img/setting-icon-light.svg" alt="Setting" /></Link>
    </div>

  )
}
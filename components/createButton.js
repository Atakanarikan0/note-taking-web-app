import Link from "next/link"
import "./createButton.css"
export default function CreateNoteButton() {
  return(
    <Link href="/create-note" className="new-note-button"><img src="/img/vector-icon.svg" alt="New Note" /></Link>
  )
}
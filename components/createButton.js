import Link from "next/link"
import "./createButton.css"
import { useContext } from "react"
import { NotesContext } from "@/src/app/context/note"


export default function CreateNoteButton({ setCreateNote , setShowArchive, setSelectedNote, setShowTag }) {
  const { screenSize } = useContext(NotesContext);
  
  return(
    <>
      {screenSize ? 
        <button onClick={() => {setCreateNote(true); setShowArchive(false); setSelectedNote([]);setShowTag(""); }} className="desktp-new-button">+ Create New Note</button>
      :
        <Link href="/create-note" className="new-note-button"><img src="/img/vector-icon.svg" alt="New Note" /></Link>
      }
    </>
  )
}
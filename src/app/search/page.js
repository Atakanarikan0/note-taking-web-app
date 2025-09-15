"use client"
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import { Fragment, useContext, useState } from "react";
import { NotesContext } from "../context/note";
import "./search.css"
import CreateNoteButton from "@/components/createButton";
import Link from "next/link";

export default function Search() {
  const { notes } = useContext(NotesContext);
  const [searchWord, setSearchWord] = useState("");
  return (
    <>
      <Header />
      <div className="search-section">
        <h2>Search</h2>
        <input type="text" className="search-input" value={searchWord || ""} onChange={e => setSearchWord(e.target.value)} />
        {searchWord.length === 0 ?
          <></>
          :
          <p>All notes matching ”{searchWord}” are displayed below.</p>
        }
        <ul className="notes-list">
          {notes.length === 0
            ?
            <p>You don’t have any notes yet. Start a new note to capture your thoughts and ideas.</p>
            :
            (notes
              .filter(note => note.title.toLowerCase().includes(searchWord.toLowerCase()))
              .map(note =>
                <Fragment key={note.id}>
                  <li className="notes-item" >
                    <Link href={`/detail/${note.id}`}>
                      <h6>{note.title}</h6>
                      <div className="tags">
                        {note.tags.map((tag, index) => (
                          <span key={index}>{tag}</span>
                        ))}
                      </div>

                      <span>
                        {new Date(note.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </Link>
                  </li>
                  <hr />
                </Fragment>
              ))
          }
          <CreateNoteButton />
        </ul>
      </div>
      <Navigation />
    </>
  )
}
"use client"
import "./archived.css"
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import { Fragment, useContext } from "react";
import { NotesContext } from "../context/note";
import CreateNoteButton from "@/components/createButton";
import Link from "next/link";

export default function Archive() {
  const { notes } = useContext(NotesContext);

  const archivedNotes = notes.filter(x => x.archived === true);
  console.log(archivedNotes);
  return (
    <>
      <Header />
      <div className="archive-container">
        <h2>Archived Notes</h2>
        <p>All your archived notes are stored here. You can restore or delete them anytime.</p>
        <ul className="notes-list">
          {archivedNotes.length === 0
            ?
            <p>No notes have been archived yet. Move notes here for safekeeping, or create a new note.</p>
            :
            (archivedNotes.map(note =>
              <Fragment key={note.id}>
                <li className="notes-item" >
                  <Link href={`/detail/${note.id}`}>
                    <h6>{note.title}</h6>
                    <div className="tags">
                      {note.tags?.map((tag, index) => (
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
"use client";
import { Fragment, useContext, useEffect, useState } from "react";
import { createClient } from "./utils/supabase/client";
import Header from "@/components/header"
import Tags from "@/src/app/tags/page"
import Navigation from "@/components/navigation"
import Link from "next/link";
import { NotesContext } from "./context/note";
import CreateNoteButton from "@/components/createButton";
import Tag from "@/src/app/tags/page";
import NoteDetail from "./detail/[id]/noteDetail";
import Settings from "./settings/page";
import CreateNote from "./create-note/page";

const supabase = createClient()

export default function Home() {
  const { notes, setNotes, screenSize } = useContext(NotesContext);
  const [selectedNote, setSelectedNote] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [createNote, setCreateNote] = useState(false);

  async function getData() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Kullanıcı alınamadı:", userError.message);
      return;
    }
    if (!user) return; // giriş yapılmamışsa

    const { data: notesData, error: notesError } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id) // sadece giriş yapan kullanıcıya ait notları getir
      .order("created_at", { ascending: false });

    setNotes(notesData);
    if (!notesError && notesData) {
    } else {
      console.log("Notes tablosu boş veya hata:", notesError);
    }

// Realtime subscription
  const channel = supabase
    .channel("notes-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notes" },
      (payload) => {
        setNotes((prevNotes) => {
          if (payload.eventType === "INSERT") {
            return [payload.new, ...prevNotes];
          }
          if (payload.eventType === "UPDATE") {
            return prevNotes.map((note) =>
              note.id === payload.new.id ? payload.new : note
            );
          }
          if (payload.eventType === "DELETE") {
            return prevNotes.filter((note) => note.id !== payload.old.id);
          }
          return prevNotes;
        });
      }
    )
    .subscribe();

  // cleanup için return
  return () => {
    supabase.removeChannel(channel);
  };


  }
useEffect(() => {
  const cleanup = getData();
  return () => {
    if (typeof cleanup === "function") cleanup();
  };
}, []);

  function handleClick(id) {
    setCreateNote(false)
    setSelectedNote(notes.find(x => x.id === id));
  }
  return (
    <div className="container">
      {screenSize ?
        <>
          <div className="header-container">
            <Header />
            <Navigation setShowSettings={setShowSettings} />
            <Tags />
          </div>
          <div className="header-bar">
            <h2>All Notes</h2>
            <input type="text" placeholder="Search by title ..." value={searchWord || ""} onChange={e => setSearchWord(e.target.value)} />
            <button onClick={() => setShowSettings(true)}><img src="/img/setting-icon-light.svg" alt="Search" /></button>
          </div>
          {showSettings
            ?
            <div className="settings-box">
              <Settings screenSize={screenSize} />
            </div>
            :
            <>
              <div className="notes">
                <CreateNoteButton setCreateNote={setCreateNote} />
                <ul className="notes-list">
                  {notes.length === 0
                    ?
                    <p>You don’t have any notes yet. Start a new note to capture your thoughts and ideas.</p>
                    :
                    (notes
                      .filter(note => note.title.toLowerCase().includes(searchWord.toLowerCase()))
                      .map(note =>
                        <Fragment key={note.id}>
                          <li className="notes-item" onClick={() => handleClick(note.id)} >
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
                          </li>
                          <hr />
                        </Fragment>
                      ))
                  }
                </ul>
              </div>
              {createNote ?
                <CreateNote />
                :
                <div className="note-detail">
                  <NoteDetail noteId={selectedNote.id} />
                </div>
              }
            </>
          }
        </>
        :
        <>
          <Header />
          <div className="notes-section">
            <h2>All Notes</h2>
            <ul className="notes-list">
              {notes.length === 0
                ?
                <p>You don’t have any notes yet. Start a new note to capture your thoughts and ideas.</p>
                :
                (notes.map(note =>
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
      }
    </div>
  )
}
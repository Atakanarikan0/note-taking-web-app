"use client";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
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
import Archive from "./archived/page";
import Loader from "./loading/page";


export default function Home() {
  const { notes, setNotes, screenSize, loading, setLoading } = useContext(NotesContext);
  const [selectedNote, setSelectedNote] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [createNote, setCreateNote] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showTag, setShowTag] = useState("");

  // useNotesRealtime({ setNotes });

  useEffect(() => {
  const supabase = createClient();

  async function getData() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Kullanıcı alınamadı:", userError.message);
      return;
    }
    if (!user) return;

    const { data: notesData, error: notesError } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (notesData) setNotes(notesData);
    if (notesError) console.log("Notes tablosu boş veya hata:", notesError);
  }

  // 1️⃣ İlk veriyi çek
  getData();

  // 2️⃣ Realtime channel oluştur
  const channel = supabase
    .channel("notes-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notes" },
      (payload) => {
        console.log("Realtime payload:", payload);

        if (payload.eventType === "INSERT") {
        return  setNotes(prev => [...prev, payload.new]);
        }

        if (payload.eventType === "UPDATE") {
         return setNotes(prev => prev.map(n => n.id === payload.new.id ? payload.new : n));
        }

        if (payload.eventType === "DELETE") {
        return  setNotes(prev => prev.filter(n => n.id !== payload.old.id));
        }
      }
    )
    .subscribe();
 getData()
  // Cleanup
  return () => {
    supabase.removeChannel(channel);
  };
}, [setNotes]);

// useEffect(() => {
//   async function getData() {
//     const { data: { user }, error: userError } = await supabase.auth.getUser();
//     if (userError) {
//       console.error("Kullanıcı alınamadı:", userError.message);
//       return;
//     }
//     if (!user) return; // giriş yapılmamışsa

//     const { data: notesData, error: notesError } = await supabase
//       .from("notes")
//       .select("*")
//       .eq("user_id", user.id) // sadece giriş yapan kullanıcıya ait notları getir
//       .order("created_at", { ascending: false });

//     setNotes(notesData);
//     if (!notesError && notesData) {
//     } else {
//       console.log("Notes tablosu boş veya hata:", notesError);
//     }

//   }
// getData()
// }, [])


  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  
  // useEffect(() => {
  //      const channel = supabase
  //     .channel("notes-changes")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "notes" },
  //       (payload) => {
  //         console.log("Realtime payload:", payload);
          

  //         if (payload.eventType === "INSERT") {
  //          return  setNotes(prev => [...prev, payload.new]);
  //         }

  //         if (payload.eventType === "UPDATE") {
  //          return setNotes(prev => prev.map(n => n.id === payload.new.id ? payload.new : n));
  //         }

  //         if (payload.eventType === "DELETE") {
  //           return setNotes(prev => prev.filter(n => n.id !== payload.old.id));
  //         }
  //       }
  //     )
  //     .subscribe();
      
  //   return () => {
  //      supabase.removeChannel(channel)
  //   };
  // }, []);

  function handleClick(id) {
    setCreateNote(false)
    setSelectedNote(notes.find(x => x.id === id));
  }
  return (
    <>
      {loading ?
        <Loader />
        :
        <div className="container">
          {screenSize ?
            <>
              <div className="header-container">
                <Header />
                <Navigation setShowSettings={setShowSettings} setShowArchive={setShowArchive} setSelectedNote={setSelectedNote} setShowTag={setShowTag} />
                <Tags setShowTag={setShowTag} showTag={showTag} setShowArchive={setShowArchive} setCreateNote={setCreateNote} setSelectedNote={setSelectedNote} setShowSettings={setShowSettings} />
              </div>
              <div className="header-bar">
                <h2>  {showSettings
                  ? "Settings"
                  : showArchive
                    ? "Archived Notes"
                    : showTag !== ""
                      ? `Notes Tagged: ${showTag}`
                      : "All Notes"} </h2>
                <input type="text" placeholder="Search by title ..." value={searchWord || ""} onChange={e => setSearchWord(e.target.value)} />
                <button onClick={() => { setShowSettings(true); setShowTag("") }}><img src="/img/setting-icon-light.svg" alt="Search" /></button>
              </div>
              {showSettings ? (
                <div className="settings-box">
                  <Settings screenSize={screenSize} />
                </div>
              ) : showArchive ? (
                <>
                  <div className="archive-notes">
                    <CreateNoteButton setCreateNote={setCreateNote} setShowSettings={setShowSettings} setShowArchive={setShowArchive} setSelectedNote={setSelectedNote} setShowTag={setShowTag} />
                    <Archive setSelectedNote={setSelectedNote} setCreateNote={setCreateNote} />
                  </div>
                  {createNote ? (
                    <CreateNote />
                  ) : (
                    <div className="note-detail">
                      <NoteDetail noteId={selectedNote.id} />
                    </div>
                  )}
                </>
              ) : showTag ? (
                <>
                  <div className="notes">
                    <CreateNoteButton setCreateNote={setCreateNote} setShowSettings={setShowSettings} setShowArchive={setShowArchive} setSelectedNote={setSelectedNote} setShowTag={setShowTag} />
                    <span>All notes with the ”{showTag}” tag are shown here.</span>
                    <ul className="notes-list">
                      {notes.filter(note => note.tags.includes(showTag)).length === 0 ? (
                        <p>No notes found for tag: {showTag}</p>
                      ) : (
                        notes
                          .filter(note => note.tags.includes(showTag))
                          .map(note => (
                            <Fragment key={note.id}>
                              <li className="notes-item" onClick={() => handleClick(note.id)}>
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
                      )}
                    </ul>
                  </div>
                  {createNote ? (
                    <CreateNote />
                  ) : (
                    <div className="note-detail">
                      <NoteDetail noteId={selectedNote.id} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="notes">
                    <CreateNoteButton setCreateNote={setCreateNote} setShowSettings={setShowSettings} setShowArchive={setShowArchive} setSelectedNote={setSelectedNote} setShowTag={setShowTag} />
                    <ul className="notes-list">
                      {notes.length === 0 ? (
                        <p>You don’t have any notes yet. Start a new note to capture your thoughts and ideas.</p>
                      ) : (
                        notes
                          .filter(note =>
                            note.title.toLowerCase().includes(searchWord.toLowerCase())
                          )
                          .map(note => (
                            <Fragment key={note.id}>
                              <li className={`notes-item ${selectedNote?.id === note.id ? "open" : ""}`}
                                onClick={() => handleClick(note.id)}>
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
                      )}
                    </ul>
                  </div>
                  {createNote ? (
                    <CreateNote />
                  ) : (
                    <div className="note-detail">
                      <NoteDetail noteId={selectedNote.id} />
                    </div>
                  )}
                </>
              )}
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
        </div >
      }
    </>
  )
}





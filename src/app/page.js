"use client";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { createClient } from "./utils/supabase/client";
import Header from "@/components/header"
import Tags from "@/src/app/tags/page"
import Navigation from "@/components/navigation"
import Link from "next/link";
import { NotesContext } from "./context/note";
import CreateNoteButton from "@/components/createButton";
import NoteDetail from "./detail/[id]/noteDetail";
import Settings from "./settings/page";
import CreateNote from "./create-note/page";
import Archive from "./archived/page";
import Loader from "./loading/page";
import { redirect } from "next/navigation";

export default function Home() {
  const { notes, setNotes, screenSize, loading, setLoading } = useContext(NotesContext);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchWord, setSearchWord] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [createNote, setCreateNote] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showTag, setShowTag] = useState("");
  const [user, setUser] = useState(null);

  // AUTH + REALTIME FIXED SETUP
  useEffect(() => {
    const supabase = createClient();
    let channel = null;
    let mounted = true;

    async function initializeApp() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          redirect('/auth/login');
          return;
        }

        setUser(session.user);

        const { data, error } = await supabase
          .from('notes')
          .select("*")
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error(error);
        } else if (mounted) {
          setNotes(data || []);
        }

        // REALTIME CHANNEL
        channel = supabase
          .channel(`realtime-${session.user.id}-${Date.now()}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'notes',
            filter: `user_id=eq.${session.user.id}`
          }, (payload) => {
            if (!mounted) return;
            switch (payload.eventType) {
              case 'INSERT':
                setNotes(prev => {
                  if (prev.find(n => n.id === payload.new.id)) {
                    return prev;
                  }
                  return [payload.new, ...prev];
                });
                break;

              case 'UPDATE':
                setNotes(prev => {
                  return prev.map(note =>
                    note.id === payload.new.id ? payload.new : note
                  );
                });
                break;

              case 'DELETE':
                setNotes(prev => {
                  return prev.filter(note => note.id !== payload.old.id);
                });
                break;
            }
          })
          .on('system', { event: 'connected' }, () => {
            setLoading(false);
          })
          .subscribe((status) => {
          });

      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          if (!channel) {
            initializeApp();
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setNotes([]);
          if (channel) {
            supabase.removeChannel(channel);
            channel = null;
          }
        }
      }
    );

    initializeApp();

    // Cleanup
    return () => {
      console.log("🧹 Component cleanup");
      mounted = false;
      subscription.unsubscribe();
      if (channel) {
        supabase.removeChannel(channel);
        console.log("🧹 Channel removed");
      }
    };
  }, [setNotes, setLoading]);

  // Loading timeout
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  function handleClick(id) {
    setCreateNote(false);
    const foundNote = notes.find(x => x.id === id);
    setSelectedNote(foundNote || null);
  }

  // 🔥 Eğer user yoksa ve loading false ise, login'e yönlendir
  if (!user && !loading) {
    return (
      <div className="container">
        <Header />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Yönlendiriliyor...</h2>
          <p>Giriş sayfasına yönlendiriliyorsunuz.</p>
        </div>
      </div>
    );
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
                <h2>
                  {showSettings ? "Settings" :
                    showArchive ? "Archived Notes" :
                      showTag !== "" ? `Notes Tagged: ${showTag}` : "All Notes"}
                </h2>
                <input
                  type="text"
                  placeholder="Search by title ..."
                  value={searchWord}
                  onChange={e => setSearchWord(e.target.value)}
                />
                <button onClick={() => { setShowSettings(true); setShowTag("") }}>
                  <img src="/img/setting-icon-light.svg" alt="Settings" />
                </button>
              </div>

              {showSettings ? (
                <div className="settings-box">
                  <Settings screenSize={screenSize} />
                </div>
              ) : showArchive ? (
                <>
                  <div className="archive-notes">
                    <CreateNoteButton
                      setCreateNote={setCreateNote}
                      setShowSettings={setShowSettings}
                      setShowArchive={setShowArchive}
                      setSelectedNote={setSelectedNote}
                      setShowTag={setShowTag}
                    />
                    <Archive setSelectedNote={setSelectedNote} setCreateNote={setCreateNote} />
                  </div>
                  {createNote ? (
                    <CreateNote />
                  ) : (
                    <div className="note-detail">
                      {selectedNote && <NoteDetail noteId={selectedNote.id} />}
                    </div>
                  )}
                </>
              ) : showTag ? (
                <>
                  <div className="notes">
                    <CreateNoteButton
                      setCreateNote={setCreateNote}
                      setShowSettings={setShowSettings}
                      setShowArchive={setShowArchive}
                      setSelectedNote={setSelectedNote}
                      setShowTag={setShowTag}
                    />
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
                      {selectedNote && <NoteDetail noteId={selectedNote.id} />}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="notes">
                    <CreateNoteButton
                      setCreateNote={setCreateNote}
                      setShowSettings={setShowSettings}
                      setShowArchive={setShowArchive}
                      setSelectedNote={setSelectedNote}
                      setShowTag={setShowTag}
                    />
                    <ul className="notes-list">
                      {notes.length === 0 ? (
                        <p>You don't have any notes yet. Start a new note to capture your thoughts and ideas.</p>
                      ) : (
                        notes
                          .filter(note =>
                            note.title.toLowerCase().includes(searchWord.toLowerCase())
                          )
                          .map(note => (
                            <Fragment key={note.id}>
                              <li
                                className={`notes-item ${selectedNote?.id === note.id ? "open" : ""}`}
                                onClick={() => handleClick(note.id)}
                              >
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
                      {selectedNote && <NoteDetail noteId={selectedNote.id} />}
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
                  {notes.length === 0 ? (
                    <p>You don't have any notes yet. Start a new note to capture your thoughts and ideas.</p>
                  ) : (
                    notes.map(note => (
                      <Fragment key={note.id}>
                        <li className="notes-item">
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
                  )}
                  <CreateNoteButton />
                </ul>
              </div>
              <Navigation />
            </>
          }
        </div>
      }
    </>
  )
}
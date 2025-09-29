"use client"
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import { NotesContext } from "@/src/app/context/note";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import "./detail.css"
import { createClient } from "../../utils/supabase/client";
import { redirect } from "next/navigation";


export default function NoteDetail({ noteId }) {
  const { notes, screenSize } = useContext(NotesContext);
  const [editTitle, setEditTitle] = useState("")
  const [editBody, setEditBody] = useState("")
  const deleteRef = useRef(null);
  const archiveRef = useRef(null);

  useEffect(() => {
    async function getPostDetail() {
      const supabase = await createClient();
      const { data, error } = await supabase.from("notes").select("*").eq("id", noteId).single();
      if (error) {
        console.error(error);
      } else {
        setEditBody(data.body);
        setEditTitle(data.title);
      }
    }
    getPostDetail()
  }, [noteId])

  if (!notes.length) return <p>Loading...</p>;

  const note = notes.find(n => n.id === parseInt(noteId));

  if (!note) return;
  function handleCancel(e) {
    e.preventDefault();
    e.target.closest('form').reset();
  }
  async function handleEdit(e) {
    const supabase = await createClient()
    e.preventDefault();
    const { data, error } = await supabase.from('notes').update({ title: editTitle, body: editBody }).eq('id', noteId).select();
    if (error) {
      console.error(error);
    } else {
      redirect("/");
    }
  }
  async function handleDelete(id) {
    const supabase = await createClient();
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (screenSize) {
      deleteRef.current.close();
    } else {
      if (error) {
        console.error(error)
      } else {
        redirect("/");
      }
    }

  }
  async function handleArchive(id) {
    const supabase = await createClient();

    const { error } = await supabase.from('notes').update({ archived: true }).eq('id', id);

    if (screenSize) {
      archiveRef.current.close();
    } else {
      if (error) {
        console.error('Arşive gönderme hatası:', error);
      } else {
        console.log('Not başarıyla arşive gönderildi!');
        redirect("/");
      }
    }
  }
  async function handleDeleteArchive(id) {
    const supabase = await createClient();

    const { error } = await supabase.from('notes').update({ archived: false }).eq('id', id);
    if (error) {
      console.error('Arşivden çıkartılmama hatası:', error);
    } else {
      console.log('Not başarıyla arşivden çıkartıldı!');
    }
  }
  return (
    <>

      {screenSize ?
        <>
          <div className="detail-container">
            <form onSubmit={handleEdit}>
              <input type="text" name="title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <div>
                <div className="note-input">
                  <img src="/img/tag-icon-light.svg" alt="tag icon" />
                  <h6 className="h6">Tags</h6>
                  <input type="text" name='tags' readOnly defaultValue={note?.tags} />
                </div>
                {note.archived && 
                <div className="note-input">
                  <img src="/img/status-icon.svg" alt="Status" />
                  <h6 className="h6">Status</h6>
                  <input type="text"  readOnly defaultValue={"Archived"} />
                </div>
                }
                <div className="note-input">
                  <img src="/img/clock-icon.svg" alt="clock icon" />
                  <h6 className="h6">Last edited</h6>
                  <input type="text" name='created_at' value={new Date(note.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })} readOnly />
                </div>
              </div>
              <hr />
              <textarea name="body"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
              ></textarea>
              <div className="btn-group">
                <button type="submit">Save Note</button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            </form>
            <div className="dlt-arch-btns">
              <button type="button" onClick={() => deleteRef.current.showModal()}><img src="/img/delete-icon.svg" alt="Delete" />Delete Note</button>
              {note.archived
                ?
                <button type="button" onClick={() => handleDeleteArchive(note.id)}><img src="/img/refresh-left.svg" alt="Restore" />Restore Note</button>
                :
                <button type="button" onClick={() => archiveRef.current.showModal()}><img src="/img/archive-icon-light.svg" alt="Archive" />Archive Note</button>
              }
            </div>
          </div>
          <dialog ref={deleteRef}>
            <h3>Delete Note</h3>
            <p>Are you sure you want to permanently delete this note? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button onClick={() => deleteRef.current.close()}>Cancel</button>
              <button onClick={() => handleDelete(note.id)}>Delete Note</button>
            </div>
          </dialog>
          <dialog ref={archiveRef}>
            <h3>Archive Note</h3>
            <p>Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.</p>
            <div className="modal-buttons">
              <button onClick={() => archiveRef.current.close()}>Cancel</button>
              <button onClick={() => handleArchive(note.id)} style={{ background: "rgba(51, 92, 255, 1)" }} className="archive-modal-button">Archive Notes</button>
            </div>
          </dialog>
        </>

        :
        <>
          <Header />
          <div className="detail-container">
            <form onSubmit={handleEdit}>
              <div className="action-bar">
                <Link href="/" className="go-back">Go Back</Link>
                <button type="button" onClick={() => deleteRef.current.showModal()}><img src="/img/delete-icon.svg" alt="Delete" /></button>
                {note.archived
                  ?
                  <button type="button" onClick={() => handleDeleteArchive(note.id)}><img src="/img/refresh-left.svg" alt="Restore" /></button>
                  :
                  <button type="button" onClick={() => archiveRef.current.showModal()}><img src="/img/archive-icon-light.svg" alt="Archive" /></button>
                }                
                <button type="button" onClick={handleCancel}>Cancel</button>
                <button type="submit">Save Note</button>
              </div>
              <input type="text" name="title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}></input>
              <div>
                <div className="note-input">
                  <img src="/img/tag-icon-light.svg" alt="tag icon" />
                  <h6 className="h6">Tags</h6>
                  <input type="text" name='tags' readOnly defaultValue={note?.tags} />
                </div>
                <div className="note-input">
                  <img src="/img/clock-icon.svg" alt="clock icon" />
                  <h6 className="h6">Last edited</h6>
                  <input type="text" name='created_at' value={new Date(note.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })} readOnly />
                </div>
              </div>
              <hr />
              <textarea name="body" value={editBody} onChange={(e) => setEditBody(e.target.value)}></textarea>
            </form>
          </div>
          <Navigation />
          <dialog ref={deleteRef}>
            <h3>Delete Note</h3>
            <p>Are you sure you want to permanently delete this note? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button onClick={() => deleteRef.current.close()}>Cancel</button>
              <button onClick={() => handleDelete(note.id)}>Delete Note</button>
            </div>
          </dialog>
          <dialog ref={archiveRef}>
            <h3>Archive Note</h3>
            <p>Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.</p>
            <div className="modal-buttons">
              <button onClick={() => archiveRef.current.close()}>Cancel</button>
              <button onClick={() => handleArchive(note.id)} style={{ background: "rgba(51, 92, 255, 1)" }} className="archive-modal-button">Archive Notes</button>
            </div>
          </dialog>
        </>
      }
    </>
  );
}

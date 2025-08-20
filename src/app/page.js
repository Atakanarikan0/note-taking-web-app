"use client";
import { Fragment, useContext, useEffect, useState } from "react";
import { createClient } from "./utils/supabase/client";
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import Link from "next/link";
import { NotesContext } from "./context/note";
import CreateNoteButton from "@/components/createButton";

const supabase = createClient()

export default function Home() {
  const { notes, setNotes } = useContext(NotesContext);

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
  }
  useEffect(() => {
    getData()
  }, [])
  return (
    <div className="container">
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
    </div>


  )


}
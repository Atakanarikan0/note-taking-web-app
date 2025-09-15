"use client"
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import "./tags.css"
import { useContext, useEffect, useState } from "react";
import { NotesContext } from "../context/note";
import { createClient } from "../utils/supabase/client";
import Link from "next/link";
import CreateNoteButton from "@/components/createButton";

export default function Tag() {
  const { notes, screenSize } = useContext(NotesContext);
  const [searchTags, setSearchTags] = useState([]);

  useEffect(() => {
    async function getTagsData() {
      const supabase = await createClient()
      const { data: tags } = await supabase.from('notes').select('tags');
      if (notes?.length === 0) return;
      const tagsArray = tags.flatMap(note => note.tags); //flatMap -> iç diziler tek bir düz diziye dönüştürülüyor     
      const uniqueTags = [...new Set(tagsArray)]; // Set-> benzersiz elemanlardan oluşur - ... ile takrar diziye çevriliyor
      setSearchTags(uniqueTags);
    }
    getTagsData()
  }, [notes])
  return (
    <>
      {screenSize ?
        <div className="tags-container">
          <h2>Tags</h2>
          <ul className="tags-list">
            {searchTags.map(tag => (
              <li key={tag} className="tags-item">
                <Link href={`/tags/${tag}`}>
                  <div>
                    <img src="/img/tag-icon-light.svg" alt="tag icon" />
                    <div className="tag-name">
                      <h6>{tag}</h6>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        :
        <>
          <Header />
          <div className="tags-container">
            <h2>Tags</h2>
            <ul className="tags-list">
              {searchTags.map(tag => (
                <li key={tag} className="tags-item">
                  <Link href={`/tags/${tag}`}>
                    <div>
                      <img src="/img/tag-icon-light.svg" alt="tag icon" />
                      <div className="tag-name">
                        <h6>{tag}</h6>
                      </div>
                    </div>

                  </Link>
                </li>

              ))}
              <CreateNoteButton />
            </ul>

          </div>
          <Navigation />
        </>


      }
    </>
  )
}
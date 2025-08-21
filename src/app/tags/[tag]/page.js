"use client"
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { useParams } from "next/navigation";
import CreateNoteButton from "@/components/createButton";
import "./tagDetail.css"

export default function TagSelected() {
  const params = useParams();
  const tag = params.tag;

  const [tagDetail, setTagDetail] = useState([]);


  useEffect(() => {
    async function getTagData() {
      const supabase = await createClient();
      const { data } = await supabase.from("notes").select("*").contains("tags", [tag]);
      setTagDetail(data);
      console.log(data);
    }
    getTagData()
  }, [tag])

  return (
    <>
      <Header />
      <div className="selected-tag-container">
        <Link href="/tags" className="go-back">Go back</Link>
        <h2>Notes Tagged: {tag}</h2>
        <p>All notes with the ”{tag}” tag are shown here.</p>
        <ul className="notes-list">
            {tagDetail.map(tag =>
              <Fragment key={tag.id}>
                <li className="notes-item" >
                  <Link href={`/detail/${tag.id}`}>
                    <h6>{tag.title}</h6>
                    <div className="tags">
                      {tag.tags.map((tag, index) => (
                        <span key={index}>{tag}</span>
                      ))}
                    </div>
                    <span>
                      {new Date(tag.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </Link>
                </li>
                <hr />
              </Fragment>
            )}
          
          <CreateNoteButton />
        </ul>
      </div>
      <Navigation />
    </>
  )
}
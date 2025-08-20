"use client"
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import Link from "next/link";
import "./create.css"
import { AddNote } from "./action";

export default function CreateNote() {
  const today = new Date().toISOString().split("T")[0];

  function handleCancel(e) {
    e.preventDefault();
    e.target.closest('form').reset();
  }
  return (
    <>
      <Header />
      <div className="create-container">
        <form action={AddNote}>
          <div className="action-bar">
            <Link href="/" className="go-back">Go Back</Link>
            <button type="button" onClick={handleCancel}>Cancel</button>
            <button type="submit">Save Note</button>
          </div>
          <input type="text" name="title" placeholder="Enter a title..."></input>
          <div>
            <div className="note-input">
              <img src="/img/tag-icon-light.svg" alt="tag icon" />
              <h6 className="h6">Tags</h6>
              <input type="text" name='tags' required placeholder="Add tags separated by commas (e.g. Work, Planning)" />
            </div>
            <div className="note-input">
              <img src="/img/clock-icon.svg" alt="clock icon" />
              <h6 className="h6">Last edited</h6>
              <input type="text" name='created_at' value={today} readOnly placeholder="Not yet saved" />
            </div>
          </div>
          <hr />
          <textarea name="body" placeholder="Start typing your note here..."></textarea>
        </form>
      </div>
      <Navigation />
    </>
  )
}
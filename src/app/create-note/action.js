"use server"

import { createClient } from "../utils/supabase/server"

export async function AddNote(formData) {
  const supabase = await createClient();


  const { data: { user }, error: userError } = await supabase.auth.getUser();

  const tags = formData.get("tags")?.split(",").map(t => t.trim()); 
  const title = formData.get("title");
  const body = formData.get("body");
  const created_at = formData.get("created_at");
  const user_id = user.id;

  const formObj = { tags, title, body, created_at, user_id }
  const { data, error } = await supabase
    .from("notes")
    .insert([formObj]);


  if (userError) {
    console.error("User fetch error:", userError.message);
    return { error: userError.message };
  }
  if (!user) {
    return { error: "Kullanıcı giriş yapmamış" };
  }


}
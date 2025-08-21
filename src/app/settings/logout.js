import { createClient } from "../utils/supabase/client";

export async function handleLogout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut();
  if(error) {
    console.error(error.message)
  }else {
    window.location.href = "/auth/login"
  }

}
"use server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "../../utils/supabase/server"

export async function signup(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  // const signupResponse = await supabase.auth.signUp(data)

  //  if (signupResponse.error) {
  //   return { error: signupResponse.error.message } // client'a döndür
  // }
  const { data: signupData ,error: signupError} = await supabase.auth.signUp(data)
    if (signupError) {
    return { error: signupError.message }
  }
  const user_id = signupData.user?.id
  if(user_id) {
      const { data: insertData ,error: insertError} = await supabase.from("users").insert([{id: user_id, email: data.email}])
    if (insertError) {
      return { error: insertError.message }
    }
  } 
  return { success: true }

  // if (signupError) {
  //   console.log(signupData);
  //   redirect('/error')
  // }

  // revalidatePath('/', 'layout')
  // redirect('/')
}
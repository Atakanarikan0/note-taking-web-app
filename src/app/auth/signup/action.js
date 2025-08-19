"use server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "../../utils/supabase/server"

export async function signup(formData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }


  const { data: signupData ,error: signupError} = await supabase.auth.signUp(data)
  
  const user_id = signupData.user?.id
  if(user_id) {
      const { data: insertData ,error: insertError} = await supabase.from("users").insert([{id: user_id, email: data.email}])
      if(insertError){
       console.error(insertError.message)
      }
  } 
  if (signupError) {
    console.log(signupData);
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
"use client"

import Link from "next/link";
import { useState } from "react";
import "./Signup.css"
import { signup } from "./action";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="signup-page">
      <div className="signup-container">
        <img src="/img/logo-light-mode.png" alt="logo" />
        <h1>Create Your Account</h1>
        <h4>Sign up to start organizing your notes and boost your productivity.</h4>
        <form className="signup-form" >
          <label>Email Address</label>
          <input type="email" name="email" placeholder="email@example.com" required />
          <div className="forgot-password">
            <label>Password</label>
            <a href="#">Forgot</a>
          </div>
          <div className="password-wrapper">
            <input type={showPassword ? 'text' : 'password'} name="password" id="password" required />
            <img onClick={() => setShowPassword(!showPassword)} src="/img/password.png" alt="Göster/Gizle" />
          </div>
          <button type="submit" formAction={signup}>Sign up</button>
        </form>
        <hr />
        <h5>Or log in with:</h5>
        <button ><img src="/img/google-icon.svg" alt="google icon" /> <h3>Google</h3></button>
        <hr />
        <h6>Already have an account?<Link href="/auth/login"> Login</Link></h6>
      </div>
    </div>
  )
}
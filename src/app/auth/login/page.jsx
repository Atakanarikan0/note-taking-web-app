"use client"
import "./Login.css"
import { useActionState, useState } from "react";
import Link from "next/link";
import { login } from "./action";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [status, formData, pending] = useActionState(login, {error: null , success: false });

  return (
    <div className="login-page">
      <div className="login-container">
        <img src="/img/logo-light-mode.png" alt="logo" />
        <h1>Welcome to Note</h1>
        <h4>Please log in to continue</h4>
        <form className="login-form" action={formData}>
          <p style={status.error ? { display: "block" } : { display: "none"}}>We're sorry, your email or password was incorrect. Plase check </p>
          <label>Email Address</label>
          <input type="email" name="email" placeholder="email@example.com" required />
          <div className="forgot-password">
            <label>Password</label>
            <a href="#">Forgot</a>
          </div>
          <div className="password-wrapper">
            <input type={showPassword ? 'text' : 'password'} name="password" id="password" required />
            <img onClick={() => setShowPassword(!showPassword)} src="/img/password.png" alt="Göster/Gizle"  />
          </div>
          <button type="submit">Login</button>
        </form>
        <hr />
        <h5>Or log in with:</h5>
        <button ><img src="/img/google-icon.svg" alt="google icon" /> <h3>Google</h3></button>
        <hr />
        <h6>No account yet? <Link href="/auth/signup">Sign Up</Link></h6>
      </div>
    </div>

  );
}
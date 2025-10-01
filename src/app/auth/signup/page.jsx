"use client"

import Link from "next/link";
import { useState } from "react";
import "./Signup.css"
import { signup } from "./action";
import { redirect } from "next/navigation"

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [criteria, setCriteria] = useState({
    lowerUpper: false,
    number: false,
    specialChar: false,
    minLength: false
  });

  async function handleSubmit(e){
  e.preventDefault();

  const values = Object.values(criteria);
  if (!values.every(Boolean)) {
    setErrorMessage("Password must meet all requirements!");
    return;
  }
  setErrorMessage(""); 
//  const result = await signup(new FormData(e.target))
//   if (result.error) {
//     setErrorMessage(result.error) 
//   } else {
//     redirect('/')
//   }
      // form verilerini al
    const formData = new FormData(e.target);

    // action.js'e gönder
    const result = await signup(formData);

    if (result?.error) {
      setErrorMessage(result.error); // Supabase’den gelen hata
    } else {
      redirect('/') // başarılıysa anasayfaya yönlendir
    }
};

  function handlePasswordChange(pwd){
    setPassword(pwd);
    setCriteria({
      lowerUpper: /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
      number: /\d/.test(pwd),
      specialChar: /[!@#$%^&*]/.test(pwd),
      minLength: pwd.length >= 8
    });
  }

  function getProgressWidth() {
    const values = Object.values(criteria);
    const passed = values.filter(Boolean).length;
    return (passed / values.length) * 100; 
  }

  function getProgressColor() {
    const width = getProgressWidth();
    if (width === 100) return "green";
    if (width >= 75) return "limegreen";
    if (width >= 50) return "orange";
    if (width >= 25) return "red";
    return "#ccc";
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <img src="/img/logo-light-mode.png" alt="logo" />
        <h1>Create Your Account</h1>
        <h4>Sign up to start organizing your notes and boost your productivity.</h4>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input type="email" name="email" placeholder="email@example.com" required />
          <div className="forgot-password">
            <label>Password</label>
            <a href="#">Forgot</a>
          </div>
          <div className="password-wrapper">
            <input type={showPassword ? 'text' : 'password'} name="password" id="password" required value={password} onChange={(e) => handlePasswordChange(e.target.value)} />

            <img onClick={() => setShowPassword(!showPassword)} src={showPassword ? "/img/eye-slash-icon.svg" : "/img/password.png"} alt="Göster/Gizle" />
          </div>
          {errorMessage && <p className="password-error">{errorMessage}</p>}
          <div className="password-strength">
            <p><span></span></p>
          <div className="progress">
            <div 
              className="progress-bar" 
              style={{ 
                width: `${getProgressWidth()}%`, 
                backgroundColor: getProgressColor(), 
                height: "4px",
                transition: "width 0.3s ease-in-out, background-color 0.3s"
              }}
            ></div>
          </div>
            <ul className="password-strength-items">
              <li>
                {criteria.lowerUpper
                  ? <svg style={{ width: "15px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="#04be4bff" d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z" /></svg>
                  : <svg style={{ width: "15px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="#e61304ff" d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z" /></svg>

                }
                <span>Lowercase & Uppercase</span>
              </li>
              <li>
                {criteria.number
                  ? <svg style={{ width: "15px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="#04be4bff" d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z" /></svg>
                  : <svg style={{ width: "15px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="#e61304ff" d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z" /></svg>

                }                
                <span>Number (0-9)</span>
              </li>
              <li>
                {criteria.specialChar
                  ? <svg style={{ width: "15px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="#04be4bff" d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z" /></svg>
                  : <svg style={{ width: "15px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="#e61304ff" d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z" /></svg>

                }
                <span>Special Character (!@#$%^&*)</span>
              </li>
              <li>
                {criteria.minLength
                  ? <svg style={{ width: "15px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="#04be4bff" d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z" /></svg>
                  : <svg style={{ width: "15px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="#e61304ff" d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z" /></svg>
                }          
                <span>Atleast 8 Character</span>
              </li>
            </ul>
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
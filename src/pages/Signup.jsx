import React, { useState, useRef } from "react";
import { isEmail } from "validator";

import AuthService from "../services/auth-service";
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const form = useRef()
  const navigate = useNavigate()
  const checkBtn = useRef()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [successful, setSuccessful] = useState(false)
  const [message, setMessage] = useState("")

  const onChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  const onChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleRegister = (e) => {
    e.preventDefault();

    if (!username) {
      setMessage('Please add a valid username')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setMessage('Not a valid email')
      return
    }

    if (password.length < 3) {
      setMessage('Password is too short')
      return
    }

    if (username && email && password) {

      setMessage("")
      setSuccessful(false)


      AuthService.signup(username, email, password).then(
        () => {
          setSuccessful(true)
          navigate("/home")
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()

          setMessage(resMessage)
          setSuccessful(false)
        }
      )
    } else {
      return
    }
  }

  return (
    <div className="auth">
      <div>
        <form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div className="form-container">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                />
              </div>

              <div>
                <button className="auth-btn">Sign Up</button>
              </div>
            </div>
          )}

          {message && (
            <div className={"alert"} onClick={() => setMessage('')}>
              <div className="alert-text">
                <div className="x">✖</div>
                {message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
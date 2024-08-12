import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import AuthService from "../services/auth-service";

const Login = () => {
  let navigate = useNavigate();

  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const onChangeUsername = (e) => {
    const username = e.target.value
    setUsername(username)
  };

  const onChangePassword = (e) => {
    const password = e.target.value
    setPassword(password)
  }

  const handleLogin = (e) => {
    e.preventDefault()

    if (username && password) {

      setMessage("")
      setLoading(true)

      AuthService.login(username, password).then(
        () => {
          navigate("/home")
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()

          setLoading(false)
          setMessage(resMessage)
        }
      )
    } else {
      return
    }
  }

  return (
    <div className="auth">
      <div className="form-container">
        <form onSubmit={handleLogin} ref={form}>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChangePassword}
            />
          </div>


          <button className="auth-btn" disabled={loading}>
            {loading ?
              <div className="spinner"></div>
              : <span>Login</span>
            }
          </button>


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

export default Login
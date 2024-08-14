import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App';
import Land from "./pages/Land"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Theme from './components/Theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Theme />
        <Routes>
          <Route path="/" element={<Land />} />
          <Route path="/home" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

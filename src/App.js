import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Land from './pages/Land';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Land />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
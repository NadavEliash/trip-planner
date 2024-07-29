import { useEffect, useState } from 'react';
import './App.css';
import Form from './components/Form';
import Map from './components/Map';
import Story from './components/Story';

function App() {
  const [encodedPolylines, setEncodedPolylines] = useState([])
  const [landmarks, setLandmarks] = useState([])
  
  return (
    <div className="App">
      <h1>Welcome to trip planner</h1>
      <Form setLandmarks={setLandmarks} setEncodedPolylines={setEncodedPolylines} />
      <Map encodedPolylines={encodedPolylines} landmarks={landmarks} />
      <Story landmarks={landmarks} />
    </div>
  );
}

export default App;

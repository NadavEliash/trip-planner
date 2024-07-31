import { useEffect, useState } from 'react';
import './App.css';
import Form from './components/Form';
import Map from './components/Map';
import Schedule from './components/Schedule';
import DayStory from './components/DayStory';

function App() {
  const [encodedPolylines, setEncodedPolylines] = useState([])
  const [landmarks, setLandmarks] = useState([])
  const [dayStories, setDayStories] = useState([])
  const [dayStory, setDayStory] = useState(null)

  const showDayTrip = (day) => {
    const currDay = dayStories.find(story=>story.day===day)
    setDayStory(currDay)
  }

  return (
    <div className="App">
      <h1>Welcome to trip planner</h1>
      <Form setLandmarks={setLandmarks} setEncodedPolylines={setEncodedPolylines} dayStories={dayStories} setDayStories={setDayStories} />
      <Map encodedPolylines={encodedPolylines} landmarks={landmarks} showDayTrip={showDayTrip} />
      <Schedule landmarks={landmarks} showDayTrip={showDayTrip} dayStories={dayStories} />
      {dayStory && <DayStory dayStory={dayStory} setDayStory={setDayStory} dayStories={dayStories} />}
    </div>
  );
}

export default App;
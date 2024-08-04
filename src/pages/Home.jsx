import { useEffect, useState } from 'react';
import Form from '../components/Form';
import Map from '../components/Map';
import Schedule from '../components/Schedule';
import Loader from '../components/Loader';
import DayPreview from '../components/DayPreview';

function Home() {
  const [encodedPolylines, setEncodedPolylines] = useState([])
  const [landmarks, setLandmarks] = useState([])
  const [days, setDays] = useState([])
  const [day, setDay] = useState(null)
  const [album, setAlbum] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const showDayTrip = (day) => {
    const currDay = days.find(story => story.day === day)
    setDay(currDay.trip)
  }

  return (
    <div className="Home">
      <h1>Trip Planner</h1>
      <Form
        setIsLoading={setIsLoading}
        setLandmarks={setLandmarks}
        setEncodedPolylines={setEncodedPolylines}
        setDays={setDays}
        setAlbum={setAlbum} />

      <Map
        encodedPolylines={encodedPolylines}
        landmarks={landmarks}
        showDayTrip={showDayTrip} />

      <Schedule
        landmarks={landmarks}
        showDayTrip={showDayTrip}
        days={days} />

      {day && <DayPreview
        day={day}
        setDay={setDay}
        days={days}
        album={album} />}

      {isLoading && <Loader />}
    </div>
  );
}

export default Home;
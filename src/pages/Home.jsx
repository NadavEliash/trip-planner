import { useEffect, useState } from 'react';
import Form from '../components/Form';
import Map from '../components/Map';
import Schedule from '../components/Schedule';
import Loader from '../components/Loader';
import DayPreview from '../components/DayPreview';
import NotFound from '../components/NotFound';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate()

  const [isError, setIsError] = useState(false)
  const [encodedPolylines, setEncodedPolylines] = useState([])
  const [landmarks, setLandmarks] = useState([])
  const [days, setDays] = useState([])
  const [day, setDay] = useState(null)
  const [currIdx, setCurrIdx] = useState(0)
  const [album, setAlbum] = useState([])

  const [username, setUsername] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) setUsername(user.username)
  }, [])

  const showDayTrip = (date) => {
    if (days.length && days[0].day) {
      const currDay = days.find(item => item.day.date === date)
      const idx = days.findIndex(item => item.day.date === date)
      setDay(currDay)
      setCurrIdx(idx)
    }
  }

  const switchDays = (value) => {
    let idx = currIdx + value
    if (idx < 0) idx = days.length - 1
    if (idx > days.length - 1) idx = 0

    setDay(days[idx])
    setCurrIdx(idx)
  }

  return (
    <div className="Home">
      {username
        ? <p className='hello-user'>Hello {username}</p>
        : <div className='pointer hello-user' onClick={() => navigate('/')}>Log in</div>}
      <h1 className='title'>Trip Planner</h1>
      <Form
        setIsLoading={setIsLoading}
        setIsError={setIsError}
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

      {day &&
        <div>
          <img className='switch-day' onClick={() => { switchDays(-1) }} src="./left.svg" alt='left' />
          <DayPreview
            day={day}
            setDay={setDay}
            days={days}
            album={album} />
          <img className='switch-day' onClick={() => { switchDays(1) }} src="./right.svg" alt='right' />
        </div>}

      {isLoading && <Loader />}
      {isError && <NotFound setIsError={setIsError} />}
    </div>
  );
}

export default Home;
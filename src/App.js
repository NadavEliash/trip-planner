import './App.css';

import { useEffect, useState } from 'react';
import Form from './components/Form';
import Map from './components/Map';
import Schedule from './components/Schedule';
import Loader from './components/Loader';
import DayPreview from './components/DayPreview';
import NotFound from './components/NotFound';
import { useNavigate } from 'react-router-dom';
import AuthService from './services/auth-service';
import authHeader from './services/auth-header';
import axios from 'axios';
import UserService from './services/user-service';
import MapService from './services/map-service';

const API_URL = process.env.REACT_APP_API_BASE_URL

export default function App() {
  const navigate = useNavigate()

  const [isError, setIsError] = useState(false)
  const [googleApiKey, setGoogleApiKey] = useState(false)
  const [encodedPolylines, setEncodedPolylines] = useState([])
  const [landmarks, setLandmarks] = useState([])
  const [days, setDays] = useState([])
  const [day, setDay] = useState(null)
  const [currIdx, setCurrIdx] = useState(0)
  const [album, setAlbum] = useState([])

  const [username, setUsername] = useState(null)
  const [userBar, setUserBar] = useState(false)
  const [userTrip, setUserTrip] = useState(null)
  const [userTrips, setUserTrips] = useState([])
  const [showUserTrips, setShowUserTrips] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dayPreview, setDayPreview] = useState(false)
  const [formMinHeight, setFormMinHeight] = useState(true)


  useEffect(() => {
    console.log("Have a pleasant trip")

    const user = JSON.parse(localStorage.getItem('user'))
    if (user) setUsername(user.username)

    axios.get(API_URL + "google_api_key", { headers: authHeader() }).then(res => setGoogleApiKey(res.data))
  }, [])

  const onLogout = () => {
    AuthService.logout()
    setUserBar(false)
    setUsername(null)
  }

  const onMyTrips = async () => {
    if (showUserTrips) {
      setShowUserTrips(false)
    } else {
      setShowUserTrips("load")
      const data = await UserService.getUserTrips(username)
      let trips = []
      if (data?.length > 0) {
        data.forEach(trip => {
          trips.push(
            {
              destination: `${trip.destination[0].toUpperCase() + trip.destination.slice(1)}`,
              from: `${trip.startDate.slice(8, 10)}/${trip.startDate.slice(5, 7)}`,
              to: `${trip.endDate.slice(8, 10)}/${trip.endDate.slice(5, 7)}`,
              data: trip
            })
        }
        )
      }

      if (trips.length > 0) {
        setShowUserTrips(true)
        setUserTrips(trips)
      }
    }
  }

  const onUserTrip = (userTrip) => {
    setShowUserTrips(false)
    setFormMinHeight(true)
    setUserTrip(userTrip)
    setLandmarks(userTrip.data.trip.landmarks)
    const polylines = MapService.createRoutes(userTrip.data.trip.routes)
    setEncodedPolylines(polylines)
    setDays(userTrip.data.days)
    setAlbum(userTrip.data.album)
    setDayPreview(true)
  }

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
    <div className="home">
      {username
        ? <div >
          <div className='hello-user' onClick={() => setUserBar(!userBar)}>🌏 {username} </div>
          {userBar &&
            <div className='logout' onClick={onLogout}>Log out</div>
          }
          {<div>
            <div className='user-trips'>
              <div className='my-trips' onClick={onMyTrips}><span className={`${showUserTrips === "load" ? 'hidden' : ''}`}>✈</span> My Trips</div>
              <div className={`${showUserTrips === "load" ? 'loader' : 'hidden'}`}></div>
              {showUserTrips === true && userTrips && userTrips.map(trip =>
                <div className='user-trip' key={trip.destination} onClick={() => onUserTrip(trip)}>{trip.destination}<span>{trip.from}-{trip.to}</span></div>
              )}
            </div>
          </div>
          }
        </div>
        : <div className='hello-user' onClick={() => navigate('/')}>Log in</div>}
      <h1 className='title'>Trip Planner</h1>
      <Form
        setIsLoading={setIsLoading}
        setIsError={setIsError}
        setDayPreview={setDayPreview}
        setLandmarks={setLandmarks}
        setEncodedPolylines={setEncodedPolylines}
        setDays={setDays}
        setAlbum={setAlbum}
        userTrip={userTrip}
        formMinHeight={formMinHeight}
        setFormMinHeight={setFormMinHeight} />

      {days.length > 0 && <Schedule
        landmarks={landmarks}
        showDayTrip={showDayTrip}
        days={days} />}

      {googleApiKey && <Map
        encodedPolylines={encodedPolylines}
        landmarks={landmarks}
        showDayTrip={showDayTrip}
        googleApiKey={googleApiKey} />}


      {day && dayPreview &&
        <DayPreview
          switchDays={switchDays}
          day={day}
          setDay={setDay}
          days={days}
          album={album} />}

      {isLoading && <Loader />}
      {isError && <NotFound setIsError={setIsError} />}
    </div>
  );
}
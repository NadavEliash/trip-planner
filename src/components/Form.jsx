import React, { useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import TripService from '../services/trip-service'
import DBService from '../services/db-service'

export default function Form({
  setIsLoading,
  setIsError,
  setDayPreview,
  setLandmarks,
  setEncodedPolylines,
  setDays,
  setAlbum
}) {

  const [anchorEl, setAnchorEl] = useState(null)
  const [checkedItems, setCheckedItems] = useState({
    eat: false,
    attraction: false,
    sport: false,
    history: false,
    kids: false
  })

  let dbDays = []
  let dbAlbum = []

  const onSubmit = async (e) => {
    e.preventDefault()
    if (e.target[0].value && e.target[1].value && e.target[2].value) {

      setLandmarks([])
      setEncodedPolylines([])
      setDays([])

      const savedTrip = await DBService.getTrip(e.target[0].value, e.target[1].value, e.target[2].value)

      if (savedTrip) {

        setLandmarks(savedTrip.trip.landmarks)
        createRoutes(savedTrip.trip.routes)

        const options = getOptions()
        if (options && options !== savedTrip.options) {
          setIsLoading(true)
          const newDays = await Promise.all(savedTrip.days.map(async (day) => {
            const recommendations = await TripService.getRecommendations(day.day.date, day.trip.places, options);
            day.trip.recommendations = recommendations;
            return day
          }))

          setDays(newDays.length ? newDays : savedTrip.days);
          setIsLoading(false)

        } else {
          setDays(savedTrip.days)
        }

        setAlbum(savedTrip.album)
        setDayPreview(true)

      } else {
        try {
          setIsLoading(true)
          const trip = await TripService.getTripData(e.target[0].value, e.target[1].value, e.target[2].value)

          const landmarks = trip.landmarks
          setLandmarks(landmarks)
          createRoutes(trip.routes)

          let landmarksByDay = []

          for (let i = 0; i < landmarks.length; i++) {


            if (landmarksByDay.length >= 1 && landmarksByDay[landmarksByDay.length - 1].date === landmarks[i].day) {
              landmarksByDay[landmarksByDay.length - 1].destinations.push({ address: landmarks[i].destination, lat: landmarks[i].lat, lng: landmarks[i].lng })
            } else {
              landmarksByDay.push({ date: landmarks[i].day, destinations: [{ address: landmarks[i].destination, lat: landmarks[i].lat, lng: landmarks[i].lng }] })
            }
          }

          const options = getOptions()
          const dayPromises = landmarksByDay.map(async (tripDay, idx) => {
            const trip = await TripService.getTripByDay(tripDay.date, tripDay.destinations, options)

            const dbDay = { day: tripDay, trip, idx }
            dbDays.push(dbDay)
            setDays(prev => [...prev, dbDay])

            setIsLoading(false)

            const placePromises = trip.places.map(async (place) => {
              const destination = e.target[0].value;
              const newPlace = await TripService.getGooglePhotos(place, destination)
              dbAlbum.push(newPlace)
              setAlbum(prev => [...prev, newPlace])
            })

            await Promise.all(placePromises)
          })

          await Promise.all(dayPromises)

          setDays(prev => sortDays(prev))
          setDayPreview(true)

          TripService.setTripData(
            e.target[0].value,
            e.target[1].value,
            e.target[2].value,
            options,
            trip,
            sortDays(dbDays),
            dbAlbum
          )


        } catch (error) {

          setIsLoading(false)
          setIsError(true)
          console.error(error)
        }
      }
    } else {
      return
    }
  }

  const createRoutes = (routes) => {
    let polylines = []

    for (let i = 0; i < routes.length; i++) {
      if (routes[i]) {
        const route = JSON.parse(routes[i])
        if (route.routes && route.routes.length) {
          polylines.push(route.routes[0].polyline.encodedPolyline)
        }
      }
    }

    setEncodedPolylines(polylines)
  }

  const sortDays = (days) => {
    let sortedDays = []

    for (let i = 0; i < days.length; i++) {
      const day = days.find(day => day.idx === i)
      sortedDays.push({ day: day.day, trip: day.trip })
    }

    return sortedDays
  }
  const toggleRecommendations = (key) => {
    const value = checkedItems[key]
    setCheckedItems(prev => ({ ...prev, [key]: !value }))
  }

  const getOptions = () => {
    const checked = Object.keys(checkedItems).filter(key => checkedItems[key])

    let options = ''

    if (checked.length) checked.forEach(item =>
      item === 'eat' ? options += 'places to eat, '
        : item === 'attraction' ? options += 'attractions, '
          : item === 'sport' ? options += 'extreme sport, '
            : item === 'history' ? options += 'history sites, '
              : item === 'kids' ? options += 'kids activities' : ''
    )

    return options
  }

  return (
    <div>
      <form className='form' onSubmit={onSubmit}>
        <div className='main-form'>
          <input type="text" name='destination' placeholder='I want to travel to...' className='destination-input' />
          <div className='dates-container'>
            <div className='dates'>
              <label className='label' htmlFor="from">from:</label>
              <input type="date" name='from' className='date-input' />
            </div>
            <div className='dates'>
              <label className='label' htmlFor="to">to:</label>
              <input type="date" name='to' className='date-input' />
            </div>
          </div>
          <div className='recommendations' onClick={(e) => { setAnchorEl(e.target) }}><span className='plus'>➕</span><span className='add'>Add recommendations</span></div>
          <Menu sx={{ left: '3px' }} open={anchorEl ? true : false} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
            <MenuItem sx={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => toggleRecommendations('eat')}>Places to eat<span className='checked'>{checkedItems.eat ? '✔' : ''}</span></MenuItem>
            <MenuItem sx={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => toggleRecommendations('attraction')}>Attractions<span className='checked'>{checkedItems.attraction ? '✔' : ''}</span></MenuItem>
            <MenuItem sx={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => toggleRecommendations('sport')}>Extreme sports<span className='checked'>{checkedItems.sport ? '✔' : ''}</span></MenuItem>
            <MenuItem sx={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => toggleRecommendations('history')}>Historic sites<span className='checked'>{checkedItems.history ? '✔' : ''}</span></MenuItem>
            <MenuItem sx={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => toggleRecommendations('kids')}>Kids activities<span className='checked'>{checkedItems.kids ? '✔' : ''}</span></MenuItem>
          </Menu>
          <button className='button'><img src="./send.svg" alt="send" /></button>
        </div>
      </form>
    </div>
  )
}
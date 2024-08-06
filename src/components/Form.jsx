import axios from 'axios'
import React, { useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import TripService from '../services/trip-service'

const Form = ({
  setIsLoading,
  setIsError,
  setLandmarks,
  setEncodedPolylines,
  setDays,
  setAlbum
}) => {

  const [anchorEl, setAnchorEl] = useState(null)
  const [checkedItems, setCheckedItems] = useState({
    eat: false,
    attraction: false,
    sport: false,
    history: false,
    kids: false
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (e.target[0]) {
      setLandmarks([])
      setEncodedPolylines([])
      setDays([])
    }

    try {
      setIsLoading(true)
      const trip = await TripService.getTripData(e.target[0].value, e.target[1].value, e.target[2].value)

      const landmarks = trip.landmarks
      setLandmarks(landmarks)
      createRoutes(trip.routes)

      let landmarksByDay = []

      for (let i = 0; i < landmarks.length; i++) {
        if (landmarksByDay.length >= 1 && landmarksByDay[landmarksByDay.length - 1].day === landmarks[i].day) {
          landmarksByDay[landmarksByDay.length - 1].destinations.push({ address: landmarks[i].destination, lat: landmarks[i].lat, lng: landmarks[i].lng })
        } else {
          landmarksByDay.push({ day: landmarks[i].day, destinations: [{ address: landmarks[i].destination, lat: landmarks[i].lat, lng: landmarks[i].lng }] })
        }
      }

      landmarksByDay.map(async (tripDay) => {
        const options = getOptions()
        const trip = await TripService.getTripByDay(tripDay.day, tripDay.destinations, options)
        
        setDays(prev => [...prev, { day: tripDay, trip }])
        
        trip.places.forEach(async (place) => {
          const newPlace = await TripService.getGooglePhotos(place)
          setAlbum(prev => [...prev, newPlace])
        })
      }
      )

      setIsLoading(false)

    } catch (error) {
      
      setIsLoading(false)
      setIsError(true)
      console.error(error)
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
          <div className='dates'>
            <label className='label' htmlFor="from">from:</label>
            <input type="date" name='from' className='date-input' />
          </div>
          <div className='dates'>
            <label className='label' htmlFor="to">to:</label>
            <input type="date" name='to' className='date-input' />
          </div>

          <div className='recommendations' onClick={(e) => { setAnchorEl(e.target) }}>Add recommendations of...</div>
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

export default Form
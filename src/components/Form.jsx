import axios from 'axios'
import React, { useState } from 'react'

const Form = ({ setLandmarks, setEncodedPolylines, dayStories, setDayStories }) => {

  const onSubmit = async (e) => {
    e.preventDefault()
    if (e.target[0]) {
      setLandmarks([])
      setEncodedPolylines([])
      setDayStories([])
    }

    try {
      const res = await axios.get(`http://localhost:8080/trip?destination=${e.target[0].value}&from=${e.target[1].value}&to=${e.target[2].value}`)
      const trip = res.data

      const landmarks = trip.landmarks
      setLandmarks(landmarks)
      createRoutes(trip.routes)

      const landmarksByDay = []

      for (let i = 0; i < landmarks.length; i++) {
        if (landmarksByDay.length >= 1 && landmarksByDay[landmarksByDay.length - 1].day === landmarks[i].day) {
          landmarksByDay[landmarksByDay.length - 1].destinations.push({ address: landmarks[i].destination, lat: landmarks[i].lat, lng: landmarks[i].lng })
        } else {
          landmarksByDay.push({ day: landmarks[i].day, destinations: [{ address: landmarks[i].destination, lat: landmarks[i].lat, lng: landmarks[i].lng }] })
        }
      }

      landmarksByDay.map(tripDay => {
        const day = tripDay.day
        const places = tripDay.destinations.reduce((acc, curr) => acc + curr.address + ", ", "")
        const options = "best street food"
        getTripByDay(day, places, options)
      }
      )
    } catch (error) {
      console.error(error)
    }
  }

  const getTripByDay = async (day, places, options = "") => {
    try {
      const dayTrip = await axios.get(`http://localhost:8080/dayTrip?day=${day}&places=${places}&options=${options}`)
      setDayStories(prev=>[...prev, { day, description: dayTrip.data }])
    } catch (error) {
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

  return (
    <div>
      <form className='form' onSubmit={onSubmit}>
        <div className='main-form'>
          <input type="text" name='destination' placeholder='I want to travel to...' className='destination-input' />
          <label htmlFor="from">From:</label>
          <input type="date" name='from' className='date-input' />
          <label htmlFor="to">To:</label>
          <input type="date" name='to' className='date-input' />
        </div>
        <button className='button'>Plan my trip!</button>
      </form>
    </div>
  )
}

export default Form
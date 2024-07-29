import axios from 'axios'
import React from 'react'

const Form = ({ setLandmarks, setEncodedPolylines }) => {

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.get(`http://localhost:8080/track?destination=${e.target[0].value}&from=${e.target[1].value}&to=${e.target[2].value}`)
    const track = res.data

    setLandmarks(track.landmarks)
    createRoutes(track.routes)
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
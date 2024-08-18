import React, { useEffect, useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import TripService from '../services/trip-service'
import DBService from '../services/db-service'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import MapService from '../services/map-service'


export default function Form({
  setIsLoading,
  setIsError,
  setDayPreview,
  setLandmarks,
  setEncodedPolylines,
  setDays,
  setAlbum,
  userTrip,
  formMinHeight,
  setFormMinHeight,
  username
}) {

  const [destination, setDestination] = useState('')
  const [range, setRange] = useState([{ startDate: null, endDate: null, key: 'selection' }])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showDates, setShowDates] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [checkedItems, setCheckedItems] = useState({
    eat: false,
    attraction: false,
    sport: false,
    history: false,
    kids: false
  })

  useEffect(() => {
    if (userTrip) {
      setDestination(userTrip.destination)
      setStartDate(userTrip.from)
      setEndDate(userTrip.to)
    }
  }, [userTrip])

  useEffect(() => {
    setStartDate(getShortDate(range[0].startDate))
    setEndDate(getShortDate(range[0].endDate))
  }, [range])

  useEffect(() => {
    setCanSubmit(!!destination && !!range[0].startDate && !!range[0].endDate)
  }, [range, destination])

  let dbDays = []
  let dbAlbum = []

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormMinHeight(true)
    if (e.target[0].value && startDate && endDate) {

      setLandmarks([])
      setEncodedPolylines([])
      setDays([])


      const fullStartDate = `${range[0].startDate.getFullYear()}-${((range[0].startDate?.getMonth() + 1) + "").padStart(2, 0)}-${(range[0].startDate?.getDate() + "").padStart(2, 0)}`
      const fullEndDate = `${range[0].endDate.getFullYear()}-${((range[0].endDate?.getMonth() + 1) + "").padStart(2, 0)}-${(range[0].endDate?.getDate() + "").padStart(2, 0)}`

      const savedTrip = await DBService.getTrip(e.target[0].value, fullStartDate, fullEndDate)

      if (savedTrip) {

        setLandmarks(savedTrip.trip.landmarks)
        const polylines = MapService.createRoutes(savedTrip.trip.routes)
        setEncodedPolylines(polylines)

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
          const trip = await TripService.getTripData(e.target[0].value, fullStartDate, fullEndDate)

          const landmarks = trip.landmarks
          setLandmarks(landmarks)
          const polylines = MapService.createRoutes(trip.routes)
          setEncodedPolylines(polylines)

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
            username,
            e.target[0].value,
            fullStartDate,
            fullEndDate,
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

  const getShortDate = (date) => {
    if (date) {
      const day = date.getDate() + ""
      const month = (date.getMonth() + 1) + ""

      return day.padStart(2, 0) + "/" + month.padStart(2, 0)
    } else {
      return '--/--'
    }
  }

  return (
    <div>
      <form className='form' onSubmit={onSubmit}>
        <div className={`main-form ${formMinHeight ? 'mobile-form' : ''}`} onClick={()=>setFormMinHeight(false)}>
          <input type="text" name='destination' placeholder='Where:' value={destination} className='destination-input' onChange={(e) => setDestination(e.target.value)} />
          <div className='dates-container'>
            <div className='dates-preview'>
              <div className='date' onClick={() => setShowDates(true)}><span className='from'>From: </span>{startDate}</div>
              <div className='dash'>–</div>
              <div className='date' onClick={() => setShowDates(true)}><span className='to'>To: </span>{endDate}</div>
            </div>
            <div className='dates'>
              {showDates && <DateRange
                editableDateInputs={true}
                onChange={item => setRange([item.selection])}
                onRangeFocusChange={(e) => setShowDates(!!e[1])}
                moveRangeOnFirstSelection={false}
                ranges={range}
                endDatePlaceholder='To:'
                startDatePlaceholder='From:'
              />}
            </div>
          </div>
          <div className='recommendations' onClick={(e) => { setAnchorEl(e.target) }}>Add interests</div>
          <Menu sx={{ left: '3px' }} open={anchorEl ? true : false} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
            <MenuItem sx={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => toggleRecommendations('eat')}>Places to eat<span className='checked'>{checkedItems.eat ? '✔' : ''}</span></MenuItem>
            <MenuItem sx={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => toggleRecommendations('attraction')}>Attractions<span className='checked'>{checkedItems.attraction ? '✔' : ''}</span></MenuItem>
            <MenuItem sx={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => toggleRecommendations('sport')}>Extreme sports<span className='checked'>{checkedItems.sport ? '✔' : ''}</span></MenuItem>
            <MenuItem sx={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => toggleRecommendations('history')}>Historic sites<span className='checked'>{checkedItems.history ? '✔' : ''}</span></MenuItem>
            <MenuItem sx={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => toggleRecommendations('kids')}>Kids activities<span className='checked'>{checkedItems.kids ? '✔' : ''}</span></MenuItem>
          </Menu>
          <button className={`button ${canSubmit ? "can" : "cannot"}`}><img src="./send.svg" alt="send" /></button>
        </div>
      </form>
    </div>
  )
}
import React, { useEffect, useState } from 'react'
import DayRow from './DayRow'

export default function Schedule({ landmarks, showDayTrip, dayStories }) {

    const [days, setDays] = useState([])

    useEffect(() => {
        if (landmarks.length) {
            const landmarksByDay = []

            for (let i = 0; i < landmarks.length; i++) {
                if (landmarksByDay.length >= 1 && landmarksByDay[landmarksByDay.length - 1].day === landmarks[i].day) {
                    landmarksByDay[landmarksByDay.length - 1].destinations.push({ address: landmarks[i].destination, lat: landmarks[i].lat, lng: landmarks[i].lng })
                } else {
                    landmarksByDay.push({ day: landmarks[i].day, destinations: [{ address: landmarks[i].destination, lat: landmarks[i].lat, lng: landmarks[i].lng }] })
                }
            }

            setDays(landmarksByDay)
        }
    }, [landmarks])

    return (
        <div className='schedule-main'>
            {days.map((day, idx) =>
                <DayRow key={idx} day={day} showDayTrip={showDayTrip} />
            )}
        </div>
    )
}
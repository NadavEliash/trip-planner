import React, { useEffect, useState } from 'react'

export default function DayRow({ day, showDayTrip }) {

    const [addresses, setAddresses] = useState('')

    useEffect(() => {
        if (day?.destinations) {
            let newAddresses = ''
            for (let i = 0; i < day.destinations.length; i++) {
                i !== day.destinations.length - 1
                    ? newAddresses += day.destinations[i].address + ", "
                    : newAddresses += day.destinations[i].address
            }
            setAddresses(newAddresses)
        }
    }, [day])

    return (
        <div className='day-row' onClick={() => showDayTrip(day.day)}>
            <h3>{day.day}</h3> 
            <p>to {addresses}</p>
        </div>
    )
}

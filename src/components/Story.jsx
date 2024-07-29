import React, { useEffect, useState } from 'react'

const Story = ({ landmarks }) => {

    const [tripStory, setTripStory] = useState('')

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

            console.log(landmarksByDay)
        }
    }, [landmarks])

    useState(() => {
        if (landmarks.length) {

            let story = ""
            for (let i = 0; i < landmarks.length - 1; i++) {
                i === landmarks.length - 2 ? story += landmarks[i].destination
                    : story += landmarks[i].destination + " ▸ "
            }

            setTripStory(story)
        }
    }, [landmarks])

    return (
        <div>{tripStory}</div>
    )
}

export default Story
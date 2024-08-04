import React, { useEffect, useState } from 'react'

export default function DayPreview({ day, setDay, days, album }) {
    const [places, setPlaces] = useState([])

    useEffect(() => {
        if (day && album) {
            const newPlaces = day.places.map(place =>
                album.find(item => item.name === place)
            ).filter(item => item !== undefined)
            setPlaces(newPlaces)
        }
    }, [day])

    return (
        <div className='day-story-main'>
            <div className='x' onClick={() => setDay(null)}>✖</div>
            <div className='description'>{day.description}</div>
            <div className='photos-container'>
            {places.length > 0 && places.map(place =>
                place.photos?.length > 0 && place.photos.map(photo =>
                    <div className='photo-div' key={photo}>
                        <img className='photo' src={photo} alt={place.name} />
                        <p className='photo-text'>{place.name}</p>
                    </div>
                )
            )}
            </div>
            <div className='recommended'>
                <h3>Recommended for you: </h3>
                {day.recommendations && day.recommendations.map((recommendation, idx) => <li className='recommended-li' key={idx}>{recommendation}</li>)}
            </div>
        </div>
    )
}
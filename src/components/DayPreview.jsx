import React, { useEffect, useState } from 'react'

export default function DayPreview({ day, setDay, days, album }) {
    const [trip, setTrip] = useState([])
    const [places, setPlaces] = useState([])
    const [largePhoto, setLargePhoto] = useState(null)

    useEffect(() => {
        if (day && album) {
            const newPlaces = day.trip.places.map(place =>
                album.find(item => item?.name === place)
            ).filter(item => item !== undefined && item !== null)

            if (newPlaces.length) setPlaces(newPlaces)
            setTrip(day.trip)
        }
    }, [day])


    return (
        <>
            {largePhoto && <div className='large-photo-container' onClick={() => setLargePhoto(null)}>

                <div className='x' onClick={() => setLargePhoto(null)}>✖</div>
                <div className='large-photo'>
                    <img src={largePhoto.src} alt='img' />
                    <div className='photo-name'>{largePhoto.name}</div>
                </div>
            </div>}
            <div className='day-story-main'>
                <div className='x' onClick={() => setDay(null)}>✖</div>
                <div className='day-story-container'>
                    {day?.day && places[0]?.name && <div className='day-preview-title'>{day.day.date}: To
                        {places.length > 0 && places.map((place, idx) =>
                            idx < places.length - 1 ?
                                <div className='to-place' key={place.name}>{place.name}, </div>
                                : <div className='to-place' key={place.name}>{place.name}.</div>
                        )}

                    </div>}
                    <div className='description'>{trip.description}</div>
                    <div className='photos-container'>
                        {places.length > 0 && places.map(place =>
                            <div key={place.name} className='place-div'>
                                <div className='photos-div'>
                                    {place?.photos?.length > 0 && place.photos.map(photo =>
                                        <div key={photo} className='photo-div'>
                                            <img onClick={() => setLargePhoto({ src: photo, name: place.name })} className='photo' src={photo} alt={place.name} />
                                        </div>
                                    )}
                                </div>
                                <h3 className='place-name'>{place.name}</h3>
                            </div>)}
                    </div>
                    <div className='recommended'>
                        {trip.recommendations?.length && <h3>Recommendation for you: </h3>}
                        {Array.isArray(trip.recommendations) && trip.recommendations.length && trip.recommendations.map((recommendation, idx) =>
                            <div key={idx} className='recommended-li'>
                                <div className='dot'>⚫</div>
                                <p>{recommendation}</p>
                            </div>)}
                    </div>
                </div>
            </div>
        </>
    )
}
import React, { useCallback, useEffect, useState } from 'react'
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import polyline from '@mapbox/polyline';

const containerStyle = {
    width: '90vw',
    maxWidth: '1000px',
    height: '400px',
    marginInline: 'auto',
    marginTop: '1rem',
    border: '1px solid black',
    borderRadius: '1rem'
};


const Map = ({ encodedPolylines, landmarks, showDayTrip, googleApiKey }) => {

    const [map, setMap] = useState(null)
    const [markers, setMarkers] = useState([])
    const [paths, setPaths] = useState([])
    const [center, setCenter] = useState({
        lat: 32.7683,
        lng: 35.217018
    })
    const [zoom, setZoom] = useState(2)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCenter({ lat: position.coords.latitude, lng: position.coords.longitude })
        })

    }, [])

    useEffect(() => {
        setPaths([])
        const decodedPaths = encodedPolylines.map(encodedPath => polyline.decode(encodedPath).map(([lat, lng]) => ({ lat, lng })))
        setPaths(decodedPaths)

        if (decodedPaths.length) {
            const startPoint = decodedPaths[0][0]
            const endPoint = decodedPaths[decodedPaths.length - 1][decodedPaths[decodedPaths.length - 1].length - 1]
            const avgLat = (startPoint.lat + endPoint.lat) / 2
            const avgLng = (startPoint.lng + endPoint.lng) / 2
            setCenter({ lat: avgLat, lng: avgLng })
        } else if (landmarks.length) {
            setCenter({
                lat: (landmarks[0].lat + landmarks[landmarks.length - 1].lat) / 2,
                lng: (landmarks[0].lng + landmarks[landmarks.length - 1].lng) / 2
            })
        }

        if (landmarks.length) {
            const latGap = landmarks[0].lat - landmarks[landmarks.length - 1].lat
            const lngGap = landmarks[0].lng - landmarks[landmarks.length - 1].lng

            if (latGap < 1 && lngGap < 1) {
                setZoom(4)
            } else {
                setZoom(6)
            }
        }

    }, [encodedPolylines])

    useEffect(() => {
        const newMarkers = []
        if (landmarks.length) {
            landmarks.forEach(landmark => {
                if (landmark.lat) {
                    newMarkers.push({ position: { lat: landmark.lat, lng: landmark.lng }, date: landmark.day, title: landmark.destination })
                }
            })

            setMarkers(newMarkers)
        }
    }, [landmarks])

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleApiKey
    })

    const onLoad = useCallback((map) => {
        map.setCenter(center)
        setMap(map)
    }, [center])

    const onUnmount = useCallback((map) => {
        setMap(null)
    }, [])

    const onMarker = (date, title) => {
        showDayTrip(date)
    }

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {paths.map((path, index) => (
                <Polyline
                    key={index}
                    path={path}
                    options={{
                        strokeColor: '#001c54',
                        strokeOpacity: 1,
                        strokeWeight: 2,
                    }}
                />
            ))}

            {markers.map((marker, idx) => (
                <Marker key={idx} position={marker.position} icon={"./location.svg"} title={marker.date + ": " + marker.title} onClick={() => {
                    onMarker(marker.date, marker.title)
                }} />
            ))}
        </GoogleMap>
    ) : <></>
}

export default Map
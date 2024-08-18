import axios from 'axios';
import authHeader from './auth-header';
import DBService from './db-service';

const API_URL = process.env.REACT_APP_API_BASE_URL

const TripService = {

    async getTripData(destination, startDate, endDate) {
        const res = await axios.get(API_URL + `trip?destination=${destination}&from=${startDate}&to=${endDate}`, { headers: authHeader() })
        return res.data
    },

    async getTripByDay(day, destinations, options = '') {
        const places = destinations.reduce((acc, curr) => acc + curr.address + ", ", '')
        try {
            const dayTrip = await axios.get(API_URL + `day_trip?day=${day}&places=${places}&options=${options}`, { headers: authHeader() })
            return dayTrip.data

        } catch (error) {
            console.error(error)
        }
    },

    async getGooglePhotos(place, destination) {
        try {

            const res = await axios.get(API_URL + `place_photos?place=${place}(${destination})`, { headers: authHeader() })
            const photos = res.data
            return { name: place, photos: [photos[0], photos[1], photos[2]] }

        } catch (error) {
            console.error(error)
        }
    },

    async setTripData(username, destination, startDate, endDate, options, trip, days, album) {

        const tripData = {
            username,
            destination: destination.toLocaleLowerCase(),
            startDate,
            endDate,
            options,
            trip,
            days,
            album
        }

        await DBService.setTrip(tripData)
    },

    async getRecommendations(date, places, options) {
        try {
            const placesStr = places.toString()
            const res = await axios.get(API_URL + `recommendation?day=${date}&places=${placesStr}&options=${options}`, { headers: authHeader() })

            return res.data

        } catch (error) {
            return console.error(error)
        }
    }

}
export default TripService
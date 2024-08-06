import axios from 'axios';
import authHeader from './auth-header';

const TripService = {
    
    async getTripData(destination, startDate, endDate) {
        const res = await axios.get(`http://localhost:8080/trip?destination=${destination}&from=${startDate}&to=${endDate}`, { headers: authHeader() })
        return res.data
    },

    async getTripByDay(day, destinations, options = '') {
        const places = destinations.reduce((acc, curr) => acc + curr.address + ", ", '')

        try {
            const dayTrip = await axios.get(`http://localhost:8080/day_trip?day=${day}&places=${places}&options=${options}`, { headers: authHeader() })
            return dayTrip.data

        } catch (error) {
            console.error(error)
        }
    },

    async getGooglePhotos(place) {
        try {

            const res = await axios.get(`http://localhost:8080/place_photos?place=${place}`, { headers: authHeader() })
            const photos = res.data
            return { name: place, photos: [photos[0], photos[1], photos[2]] }

        } catch (error) {
            console.error(error)
        }
    }

}
export default TripService
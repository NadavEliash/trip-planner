import axios from "axios"
import authHeader from "./auth-header"

const API_URL = process.env.REACT_APP_API_BASE_URL

const DBService = {

    async getTrip(destination, startDate, endDate) {
        try {
            const tripData = axios.post(API_URL + 'api/db/gettrip',
                {
                    destination: destination.toLocaleLowerCase(),
                    startDate,
                    endDate
                },
                { headers: authHeader() })

            return (await tripData).data

        } catch (error) {
            console.error(error)
        }
    },

    async setTrip(tripData) {
        try {
            axios.post(API_URL + 'api/db/settrip', tripData, { headers: authHeader() })

        } catch (error) {
            console.error(error)
        }
    }
}

export default DBService
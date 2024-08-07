import axios from "axios"
import authHeader from "./auth-header"

const DBService = {

    async getTrip(destination, startDate, endDate) {
        try {
            const tripData = axios.post('http://localhost:8080/api/db/gettrip',
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
            axios.post('http://localhost:8080/api/db/settrip', tripData, { headers: authHeader() })

        } catch (error) {
            console.error(error)
        }
    }
}

export default DBService
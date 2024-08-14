import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_BASE_URL

const UserService = {
  getPublicContent() {
    return axios.get(API_URL + 'api/test/all');
  },

  async getUserTrips(username) {
    try {
      const trips = axios.get(API_URL + `api/db/getusertrips?username=${username}`, { headers: authHeader() })
      return (await trips).data

    } catch (error) {
      console.error(error)
    }
  }
}

export default UserService
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_BASE_URL

const UserService = {
  getPublicContent() {
    return axios.get(API_URL + 'api/test/all');
  }
}

export default UserService
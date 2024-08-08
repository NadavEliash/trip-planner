import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL

const AuthService = {
  async login(username, password) {
    return axios
      .post(API_URL + "api/auth/login", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      })
  },

  logout() {
    localStorage.removeItem("user");
  },

  async signup(username, email, password) {
    return axios.post(API_URL + "api/auth/signup", {
      username,
      email,
      password
    })
    .then(response => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    })
},

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));;
  }
}

export default AuthService
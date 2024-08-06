import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const AuthService = {
  async login(username, password) {
    return axios
      .post(API_URL + "login", {
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
    return axios.post(API_URL + "signup", {
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
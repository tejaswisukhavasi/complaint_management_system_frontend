import axios from 'axios';

// Set base URL from environment variable or use proxy in development
if (process.env.REACT_APP_API_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
}

// Set default headers
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;

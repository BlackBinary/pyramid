const axios = require('axios');
const auth = require('./auth');
const logger = require('../logger');

// Get the coinbase api url from the env
const {
  COINBASE_API_URL,
} = process.env;

// Create an new Axios client
const client = axios.create({
  baseURL: COINBASE_API_URL,
  timeout: 1000,
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
    'Accept-Charset': 'utf-8',
    'User-Agent': 'CPTB Client',
  },
  json: true,
});

// Add response interceptors for the client
client.interceptors.response.use(
  // Responses should always resolve without interference
  (response) => Promise.resolve(response),
  // Errors should always reject after being logged
  (error) => {
    logger.error(error.response.data);
    logger.error(error.response.status);
    return Promise.reject(error);
  },
);

// Add a helper function to add options to each request as necessary
const options = async (requiresAuth, method, path, body = '') => {
  if (requiresAuth) {
    const headers = await auth.generateAuthHeaders(method, path, body);
    return { headers };
  }
  return {};
};

// Export the getRequest function to be used by other parts of the application
module.exports.getRequest = async (path, requiresAuth = true) => {
  const requestOptions = await options(requiresAuth, 'GET', path);

  const { data, status } = (await client.get(path, requestOptions));

  if (status !== 200) {
    logger.error('Request failed');
  }

  return data;
};

const axios = require('axios');
const config = require('./auth');
const getToken = require('./token');

function getDateRange() {
  const end = new Date();
  const start = new Date(end);
  start.setMonth(start.getMonth() - 1);
  return {
    from: start.toISOString().split('T')[0],
    to: end.toISOString().split('T')[0]
  };
}

async function makeApiCall(endpoint, params = {}) {
  try {
    const token = await getToken();
    console.log(`Making API call to: ${config.zoomApiBaseUrl}${endpoint} with params:`, params);
    const response = await axios.get(`${config.zoomApiBaseUrl}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: params
    });
    return response.data;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.response ? error.response.data : error.message);
    throw error;
  }
}

async function pushDataToEndpoint(data) {
  try {
    const response = await axios.post(config.endpointUrl, data);
    console.log('Data successfully pushed to endpoint:', response.status);
  } catch (error) {
    console.error('Error pushing data to endpoint:', error.response ? error.response.data : error.message);
  }
}

module.exports = {
  getDateRange,
  makeApiCall,
  pushDataToEndpoint
};

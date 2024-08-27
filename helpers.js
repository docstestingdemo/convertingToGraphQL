const axios = require('axios');
const config = require('./auth');
const getToken = require('./token');

function getDateRange(months = 6) {
  const end = new Date();
  const start = new Date(end);
  start.setMonth(start.getMonth() - months);

  const dateRanges = [];
  let currentDate = start;
  while (currentDate <= end) {
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 30);
    if (endDate > end) {
      endDate.setDate(end.getDate());
    }
    dateRanges.push({
      from: currentDate.toISOString().split('T')[0],
      to: endDate.toISOString().split('T')[0]
    });
    currentDate.setDate(currentDate.getDate() + 31);
  }

  return dateRanges;
}
async function makeApiCall(endpoint, params = {}) {
  try {
    const token = await getToken();
    if (endpoint.includes('/metrics')) {
      params.type = 'past';
    }
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
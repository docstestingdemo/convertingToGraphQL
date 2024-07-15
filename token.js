const axios = require('axios');
const qs = require('querystring');
const config = require('./auth');

async function getToken() {
  try {
    const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
    const response = await axios.post('https://zoom.us/oauth/token',
      qs.stringify({
        grant_type: 'account_credentials',
        account_id: config.accountId
      }), {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    console.log('Token response:', response.data);
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = getToken;

# Fetching Data from Zoom

This project is designed to fetch data from various Zoom Phone APIs and user-related endpoints, then push the collected data to a specified endpoint.

## Features

- Fetches data from multiple Zoom Phone APIs
- Retrieves user-related information
- Handles authentication using Zoom OAuth
- Pushes collected data to a specified endpoint

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure the `auth.js` file with your Zoom API credentials:
   - `accountId`
   - `clientId`
   - `clientSecret`
   - `endpointUrl` (where the data will be pushed)

## Usage

Run the main script:

node server.js

This will:
1. Fetch an OAuth token
2. Make API calls to various Zoom Phone endpoints
3. Collect user-related data
4. Push all collected data to the specified endpoint

## File Structure

- `auth.js`: Configuration file for API credentials
- `helpers.js`: Utility functions for API calls and data handling
- `token.js`: Handles OAuth token retrieval
- `server.js`: Main script that orchestrates the data fetching and pushing process

## API Endpoints

The script fetches data from the following Zoom Phone API endpoints:
- `/phone/call_history`
- `/phone/call_logs`
- `/phone/recordings`
- `/phone/voicemails`
- `/phone/sms`
- `/phone/users`

And the following user-related endpoints:
- `/users`
- `/users/me/settings`
- `/users/me/meetings`
- `/users/me/webinars`

## Error Handling

The script includes error handling for API calls and data pushing. Errors are logged to the console for debugging purposes.

## Dependencies

- axios: For making HTTP requests
- querystring: For OAuth token request

## Note

Ensure that your Zoom account has the necessary permissions to access the Phone API endpoints used in this script.



---
# High Level Context
## context
**Last Updated at:** 10/16/2024, 5:32:30 PM

Summary:
This code file, named 'helpers.js', contains utility functions for making API calls to Zoom, handling date ranges, and pushing data to an endpoint. It uses axios for HTTP requests and relies on external configuration and token management.

Methods:

1. getDateRange(months = 6)
   Generates an array of date ranges spanning the specified number of months.

   Example:
   ```javascript
   const dateRanges = getDateRange(3);
   console.log(dateRanges);
   // Output: [{from: '2023-03-01', to: '2023-03-31'}, {from: '2023-04-01', to: '2023-04-30'}, {from: '2023-05-01', to: '2023-05-31'}]
   ```

2. makeApiCall(endpoint, params = {})
   Makes an API call to the specified Zoom endpoint with given parameters.

   Example:
   ```javascript
   const userData = await makeApiCall('/users/me');
   console.log(userData);
   ```

3. pushDataToEndpoint(data)
   Pushes data to a configured endpoint using a POST request.

   Example:
   ```javascript
   const dataToSend = { key: 'value' };
   await pushDataToEndpoint(dataToSend);
   ```

# Assuming the function is deployed as a Cloud Function
import requests

url = "https://your-cloud-function-url"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Basic base64encoded_username:password"
}
payload = {
    "profile": {"id": "user123", "name": "John Doe"},
    "pastMeetings": [{"id": "meeting123", "topic": "Team Sync"}]
}

response = requests.post(url, json=payload, headers=headers)
print(response.text)
```

Helper function:

def ingest_zoom(model: ZoomModel):
    # Function body

This function handles the actual ingestion of a single ZoomModel instance into Neo4j.

Example usage:
```python
from zoom_model import ZoomModel

model = ZoomModel(profile={"id": "user123", "name": "John Doe"},
                  pastMeetings=[{"id": "meeting123", "topic": "Team Sync"}])
result = ingest_zoom(model)
print(result)
```

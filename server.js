const fs = require('fs');
const path = require('path');
const { getDateRange, makeApiCall } = require('./helpers');
const util = require('util');
const getToken = require('./token');

let cachedToken = null;

async function writeDataToFile(data, filename) {
  try {
    const filePath = path.join(__dirname, 'data', `${filename}.txt`);
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    
    let existingData = {};
    if (fs.existsSync(filePath)) {
      existingData = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
    }
    
    const processedData = processData({ ...existingData, ...data });
    await fs.promises.writeFile(filePath, JSON.stringify(processedData, null, 2), 'utf8');
    console.log(`Successfully processed and wrote data to ${filename}.txt`);
  } catch (error) {
    console.error(`Error writing data to file ${filename}.txt:`, error.message);
    throw error;
  }
}
function mergeDeep(target, source) {
  const isObject = (obj) => obj && typeof obj === 'object';
  
  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
}
function logApiCallAndResponse(url, response) {
  console.log(`API call made to: ${url}`);
  if (response && typeof response === 'object') {
    if (Array.isArray(response)) {
      console.log(`API response: Array with ${response.length} items`);
    } else {
      const keys = Object.keys(response);
      console.log(`API response: Object with keys: ${keys.join(', ')}`);
    }
  } else {
    console.log(`API response: ${typeof response}`);
  }
}

async function fetchAllData() {
  setupConsoleLogging();
  await initializeToken();
  const dateRanges = getDateRange();

  const users = await makeApiCall('/users');
  
  for (const user of users.users) {
    await writeDataToFile({ profile: user }, `user_${user.id}`);
    await fetchUserSpecificData(user.id, dateRanges);
  }

  await fetchMeetingData(dateRanges);
  await fetchOtherData(dateRanges);
}async function fetchUserSpecificData(userId, dateRange) {
  const userApiCalls = [
    { endpoint: `/users/${userId}`, dataType: 'profile' },
 //   { endpoint: `/users/${userId}/recordings`, dataType: 'recordings' },
  ];

  const userData = {};
  for (const apiCall of userApiCalls) {
    try {
      const result = await makeApiCall(apiCall.endpoint, dateRange);
      logApiCallAndResponse(`https://api.zoom.us/v2${apiCall.endpoint}`, result);
      userData[apiCall.dataType] = result;
    } catch (error) {
      console.error(`Error fetching data for ${apiCall.endpoint}:`, error.message);
    }
  }
  
  await writeDataToFile(userData, `user_${userId}`);
}

function encodeUUID(uuid) {
  return encodeURIComponent(encodeURIComponent(uuid));
}

async function fetchMeetingData(dateRanges) {
  const users = await makeApiCall('/users');
  logApiCallAndResponse('https://api.zoom.us/v2/users', users);

  for (const user of users.users) {
    let allMeetings = { meetings: [] };
    for (const dateRange of dateRanges) {
      try {
        const meetings = await makeApiCall(`/report/users/${user.id}/meetings`, dateRange);
        logApiCallAndResponse(`https://api.zoom.us/v2/report/users/${user.id}/meetings`, meetings);

        if (meetings.meetings && meetings.meetings.length > 0) {
          for (let meeting of meetings.meetings) {
            try {
              const participantMetrics = await makeApiCall(`/metrics/meetings/${meeting.uuid}/participants`);
              logApiCallAndResponse(`https://api.zoom.us/v2/metrics/meetings/${meeting.uuid}/participants`, participantMetrics);
              meeting.participants_data = participantMetrics.participants;

              const recordings = await makeApiCall(`/meetings/${meeting.uuid}/recordings`);
              logApiCallAndResponse(`https://api.zoom.us/v2/meetings/${meeting.uuid}/recordings`, recordings);
              meeting.recordings = recordings;

              const meetingSummary = await makeApiCall(`/meetings/${meeting.uuid}/meeting_summary`);
              logApiCallAndResponse(`https://api.zoom.us/v2/meetings/${meeting.uuid}/meeting_summary`, meetingSummary);
              meeting.meeting_summary = meetingSummary;

            } catch (error) {
              console.error(`Error fetching participant data for meeting ${meeting.uuid}:`, error.message);
            }
          }
          allMeetings.meetings = allMeetings.meetings.concat(meetings.meetings);
        }
      } catch (error) {
        console.error(`Error fetching meetings for user ${user.id}:`, error.message);
      }
    }
    await writeDataToFile({ meetings: allMeetings }, `user_${user.id}`);
    console.log(`Successfully fetched and stored meetings with additional data for user ${user.id}`);
  }
}
async function fetchOtherData(dateRange) {
  const otherApiCalls = [
    // Add any other API calls you want to make here
  ];

  for (const apiCall of otherApiCalls) {
    try {
      const result = await apiCall.call;
      logApiCallAndResponse(`https://api.zoom.us/v2${apiCall.endpoint}`, result);
      const filename = `other_data`;
      await writeDataToFile({ [apiCall.endpoint]: result }, filename);
    } catch (error) {
      console.error(`Error fetching data for ${apiCall.endpoint}:`, error.message);
    }
  }
}

function setupConsoleLogging() {
  const logFile = fs.createWriteStream('console_log.txt', { flags: 'a' });
  const logStdout = process.stdout;

  console.log = function() {
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
  }
  console.error = console.log;
}

async function initializeToken() {
  if (!cachedToken) {
    cachedToken = await getToken();
    console.log('Token initialized successfully');
  }
  return cachedToken;
}

initializeToken().then(() => {
  fetchAllData().catch(console.error);
}).catch(console.error);

function processData(data) {
  const processedData = {
    profile: data.profile || {},
    pastMeetings: []
  };

  const meetingsMap = new Map();

  // Process meetings and recordings
  ['meetings', 'recordings'].forEach(dataType => {
    if (data[dataType] && data[dataType].meetings) {
      data[dataType].meetings.forEach(item => {
        const existingMeeting = meetingsMap.get(item.uuid) || {};
        meetingsMap.set(item.uuid, {
          ...existingMeeting,
          ...item,
          participants_data: [...new Set([...(existingMeeting.participants_data || []), ...(item.participants_data || [])])],
          recording_files: [...new Set([...(existingMeeting.recording_files || []), ...(item.recording_files || [])])]
        });
      });
    }
  });

  processedData.pastMeetings = Array.from(meetingsMap.values())
    .map(meeting => ({
      details: {
        uuid: meeting.uuid,
        id: meeting.id,
        topic: meeting.topic,
        type: meeting.type,
        start_time: meeting.start_time,
        duration: meeting.duration,
        total_minutes: meeting.total_minutes,
        participants_count: meeting.participants_count,
        share_url: meeting.share_url
      },
      participants: meeting.participants_data,
      recordings: meeting.recording_files,
      summary: meeting.meeting_summary || {}
    }))
    .sort((a, b) => new Date(b.details.start_time) - new Date(a.details.start_time));

  return processedData;
}


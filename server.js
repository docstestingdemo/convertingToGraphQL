const { getDateRange, makeApiCall, pushDataToEndpoint } = require('./helpers');

async function fetchAllData() {
  const dateRange = getDateRange();

  const phoneApiCalls = [
    makeApiCall('/phone/call_history', dateRange),
    makeApiCall('/phone/call_logs', dateRange),
    makeApiCall('/phone/recordings', dateRange),
    makeApiCall('/phone/voicemails', dateRange),
    makeApiCall('/phone/sms', dateRange),
    makeApiCall('/phone/users'),
    makeApiCall('/phone/blocked_list'),
    makeApiCall('/phone/devices'),
    makeApiCall('/phone/calling_plans'),
    makeApiCall('/phone/auto_receptionists'),
    makeApiCall('/phone/ivr'),
    makeApiCall('/phone/call_queues'),
    makeApiCall('/phone/common_area_phones'),
    makeApiCall('/phone/policy'),
    makeApiCall('/phone/sites'),
    makeApiCall('/phone/numbers'),
    makeApiCall('/phone/emergency_addresses'),
    makeApiCall('/phone/groups'),
    makeApiCall('/phone/settings'),
    makeApiCall('/phone/call_monitoring_groups'),
    makeApiCall('/phone/shared_line_groups'),
    makeApiCall('/phone/cost_centers'),
    makeApiCall('/phone/audio_library'),
    makeApiCall('/phone/outbound_caller_id'),
    makeApiCall('/phone/hunt_groups')
  ];

  const userApiCalls = [
    makeApiCall('/users'),
    makeApiCall('/users/me/settings'),
    makeApiCall('/users/me/meetings'),
    makeApiCall('/users/me/webinars'),
    makeApiCall('/users/me/permissions'),
    makeApiCall('/users/me/token'),
    makeApiCall('/users/me/assistants'),
    makeApiCall('/users/me/schedulers'),
    makeApiCall('/users/me/recordings'),
    makeApiCall('/users/me/phone'),
    makeApiCall('/users/me/tsp'),
    makeApiCall('/users/me/sip_phones'),
    makeApiCall('/users/me/zoom_rooms')
  ];

  const meetingApiCalls = [
    makeApiCall('/meetings', { type: 'scheduled' }),
    makeApiCall('/past_meetings', { type: 'past' }),
    makeApiCall('/metrics/meetings', dateRange),
    makeApiCall('/metrics/webinars', dateRange),
    makeApiCall('/report/meetings', dateRange),
    makeApiCall('/report/webinars', dateRange),
    makeApiCall('/meeting_templates'),
    makeApiCall('/users/me/meetings/settings'),
    makeApiCall('/users/me/webinars/settings'),
    makeApiCall('/metrics/qos', dateRange),
    makeApiCall('/past_webinars', { type: 'past' }),
    makeApiCall('/webinars', { type: 'scheduled' }),
    makeApiCall('/report/daily', dateRange)
  ];

  try {
    const phoneResults = await Promise.allSettled(phoneApiCalls);
    const phoneData = phoneResults
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

    const userResults = await Promise.allSettled(userApiCalls);
    const userData = userResults
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

    const meetingResults = await Promise.allSettled(meetingApiCalls);
    const meetingData = meetingResults
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

    const allData = { phoneData, userData, meetingData };

    await pushDataToEndpoint(allData);

  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
  }
}

fetchAllData();

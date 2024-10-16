

---
# High Level Context
## context
**Last Updated at:** 10/16/2024, 5:32:22 PM

Overview:
This code file defines several Pydantic models for representing meeting-related data, including summaries, participants, and meeting details. The main class is `Meeting`, which encapsulates all the information about a meeting.

Main Classes and Their Methods:

1. Summary
   - `model_dump(**kwargs)`: Customizes the model serialization to exclude summary details.

   Example:
   ```python
   summary = Summary(meeting_host_id="123", meeting_host_email="host@example.com", meeting_uuid="abc123", meeting_id=1, meeting_topic="Team Meeting", meeting_start_time="2023-01-01T10:00:00", meeting_end_time="2023-01-01T11:00:00", summary_start_time="2023-01-01T11:05:00", summary_end_time="2023-01-01T11:10:00", summary_created_time="2023-01-01T11:15:00", summary_last_modified_time="2023-01-01T11:20:00", summary_title="Team Meeting Summary")
   summary_dict = summary.model_dump()
   ```

2. Participant
   No public methods, but defines various attributes for meeting participants.

3. Details
   No public methods, but defines attributes for meeting details.

4. Meeting
   - `empty_dict_to_none_recordings(cls, v)`: Validator to convert empty dictionaries to None for recordings.
   - `empty_dict_to_none_summary(cls, v)`: Validator to convert empty dictionaries to None for summary.

   Example:
   ```python
   meeting = Meeting(
       details=Details(uuid="123", id=1, topic="Team Meeting", type=2, start_time=datetime.now(), duration=60, total_minutes=60, participants_count=5),
       participants=[Participant(participant_uuid="456", user_name="John Doe", device="Windows", ip_address="192.168.1.1", location="New York", network_type="Wired", data_center="US", full_data_center="US-East", join_time=datetime.now(), leave_time=datetime.now() + timedelta(hours=1), share_application=False, share_desktop=False, share_whiteboard=False, recording=False, leave_reason="Meeting ended", status="Joined", os="Windows", health="Good", role="Attendee")],
       recordings={},
       summary={}
   )
   ```

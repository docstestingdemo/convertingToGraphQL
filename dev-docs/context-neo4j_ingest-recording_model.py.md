

---
# High Level Context
## context
**Last Updated at:** 10/16/2024, 5:31:53 PM

Summary:
This code file defines a Pydantic model called `Recording` that represents a recording of a meeting. It utilizes type hints and Pydantic's BaseModel for data validation and serialization.

Main Code Object: Recording (Pydantic Model)

Attributes:
- id: str
- meeting_id: str
- recording_start: datetime
- recording_end: datetime
- file_type: str
- file_extension: str
- file_size: int
- play_url: Optional[str]
- download_url: Optional[str]
- status: str
- recording_type: str

Configuration:
- model_config: ConfigDict(extra="ignore")

This model does not define any methods explicitly. However, being a Pydantic model, it inherits several methods from BaseModel. Here are some commonly used methods:

1. dict()
   Example:
   ```python
   recording = Recording(id="123", meeting_id="456", recording_start=datetime.now(), recording_end=datetime.now(), file_type="mp4", file_extension=".mp4", file_size=1000000, status="completed", recording_type="video")
   recording_dict = recording.dict()
   ```

2. json()
   Example:
   ```python
   recording = Recording(id="123", meeting_id="456", recording_start=datetime.now(), recording_end=datetime.now(), file_type="mp4", file_extension=".mp4", file_size=1000000, status="completed", recording_type="video")
   recording_json = recording.json()
   ```

3. parse_obj()
   Example:
   ```python
   data = {
       "id": "123",
       "meeting_id": "456",
       "recording_start": "2023-05-01T10:00:00",
       "recording_end": "2023-05-01T11:00:00",
       "file_type": "mp4",
       "file_extension": ".mp4",
       "file_size": 1000000,
       "status": "completed",
       "recording_type": "video"
   }
   recording = Recording.parse_obj(data)
   ```

4. parse_raw()
   Example:
   ```python
   json_data = '{"id": "123", "meeting_id": "456", "recording_start": "2023-05-01T10:00:00", "recording_end": "2023-05-01T11:00:00", "file_type": "mp4", "file_extension": ".mp4", "file_size": 1000000, "status": "completed", "recording_type": "video"}'
   recording = Recording.parse_raw(json_data)
   ```

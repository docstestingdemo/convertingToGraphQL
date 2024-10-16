

---
# High Level Context
## context
**Last Updated at:** 10/16/2024, 5:31:39 PM

Summary:
The code file 'zoom_model.py' defines a Pydantic model called ZoomModel, which represents a structure for Zoom-related data. It includes a user profile and a list of past meetings.

Main Code Object: ZoomModel

Fields:
1. profile: Profile
   - Represents the user's profile information
   - Type: Profile (imported from profile_model)

2. pastMeetings: List[Meeting]
   - A list of past meetings
   - Type: List of Meeting objects (imported from meeting_model)

Configuration:
- model_config = ConfigDict(extra="ignore")
  - Configures the model to ignore any extra fields not defined in the model

Methods:
ZoomModel does not define any custom methods. It inherits the default methods provided by Pydantic's BaseModel class, such as:

1. dict()
   Example:
   ```python
   zoom_data = ZoomModel(profile=user_profile, pastMeetings=meeting_list)
   zoom_dict = zoom_data.dict()
   ```

2. json()
   Example:
   ```python
   zoom_data = ZoomModel(profile=user_profile, pastMeetings=meeting_list)
   zoom_json = zoom_data.json()
   ```

3. parse_obj()
   Example:
   ```python
   data = {
       "profile": {...},  # Profile data
       "pastMeetings": [...]  # List of meeting data
   }
   zoom_model = ZoomModel.parse_obj(data)
   ```

4. parse_raw()
   Example:
   ```python
   json_data = '{"profile": {...}, "pastMeetings": [...]}'
   zoom_model = ZoomModel.parse_raw(json_data)
   ```

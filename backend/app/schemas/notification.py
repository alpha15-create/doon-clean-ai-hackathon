from pydantic import BaseModel

class NotificationItem(BaseModel):
    id: str
    title: str
    message: str
    time: str
    type: str  # alert, success, warning, info
    read: bool

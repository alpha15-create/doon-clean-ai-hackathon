from typing import Optional
from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    fullName: Optional[str] = None
    name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    password: str
    role: Optional[str] = "citizen"

class UserPublic(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    avatar: Optional[str] = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    points: Optional[int] = 50
    level: Optional[str] = "Eco Contributor (Level 1)"
    designation: Optional[str] = None
    department: Optional[str] = None
    teamId: Optional[str] = None
    teamName: Optional[str] = None
    vehicleNumber: Optional[str] = None

class AuthResponseData(BaseModel):
    user: UserPublic
    token: str

class StandardApiResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = "Success"

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user model with common attributes."""

    email: EmailStr = Field(
        description="User's email address", examples=["user@example.com"]
    )


class UserCreate(UserBase):
    """Model for creating a new user."""

    password: str = Field(
        description="User's password",
        min_length=8,
        max_length=100,
        examples=["strongpassword123"],
    )


class UserResponse(UserBase):
    """Model for user responses, excluding sensitive data."""

    id: int = Field(description="Unique identifier for the user")

    model_config = {
        "json_schema_extra": {"example": {"id": 1, "email": "user@example.com"}}
    }


class UserInDB(UserResponse):
    """Model for user in database, including hashed password."""

    hashed_password: str = Field(description="Hashed version of the user's password")

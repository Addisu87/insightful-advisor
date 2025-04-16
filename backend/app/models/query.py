from uuid import UUID

from pydantic import BaseModel, Field


class UserQuery(BaseModel):
    """Model for natural language queries from users."""

    question: str = Field(
        description="Natural language question from the user",
        min_length=1,
        max_length=1000,
        examples=["What were the total sales in Q1 2024?"],
    )
    client_id: UUID = Field(
        description="Unique identifier for the client making the query"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "question": "What were the total sales in Q1 2024?",
                "client_id": "123e4567-e89b-12d3-a456-426614174000",
            }
        }
    }

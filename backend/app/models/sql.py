from pydantic import BaseModel, Field


class SQLQuery(BaseModel):
    """SQL query generated from natural language."""

    query: str = Field(
        description="The generated SQL query",
        examples=["SELECT * FROM transactions WHERE date >= '2024-01-01'"],
    )
    description: str = Field(
        description="Human-readable description of what the query does",
        examples=["Query to get all transactions from 2024"],
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "query": "SELECT * FROM transactions WHERE date >= '2024-01-01'",
                "description": "Query to get all transactions from 2024",
            }
        }
    }

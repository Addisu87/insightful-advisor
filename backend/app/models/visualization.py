from typing import Any, Dict

from pydantic import BaseModel, Field


class Visualization(BaseModel):
    """Visualization configuration for insights."""

    type: str = Field(
        default="bar",
        description="Type of visualization (e.g., bar, line, pie)",
        examples=["bar", "line", "pie"],
    )
    data: Dict[str, Any] = Field(
        ...,  # ... means required
        description="Data points for the visualization",
        examples=[{"labels": ["Jan", "Feb"], "values": [100, 200]}],
    )
    config: Dict[str, Any] = Field(
        ...,
        description="Configuration options for the visualization",
        examples=[{"title": "Monthly Transactions"}],
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "type": "bar",
                    "data": {"labels": ["Jan", "Feb"], "values": [100, 200]},
                    "config": {"title": "Monthly Transactions"},
                }
            ]
        }
    }

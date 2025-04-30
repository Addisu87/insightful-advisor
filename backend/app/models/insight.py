from typing import Any, Dict, List

from pydantic import BaseModel, Field

from .visualization import Visualization


class InsightResponse(BaseModel):
    """Comprehensive analysis of data with visualizations."""

    summary: str = Field(
        description="Summary of the analysis insights",
        examples=["Analysis shows increasing transaction volumes in Q1 2024"],
    )
    sql_query: str = Field(
        description="The SQL query used to generate the insights",
        examples=["SELECT * FROM transactions WHERE date >= '2024-01-01'"],
    )
    data: Dict[str, Any] = Field(description="Raw data results from the query")
    visualizations: List[Visualization] = Field(
        description="List of visualizations generated from the data"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "summary": "Analysis shows increasing transaction volumes in Q1 2024",
                "sql_query": "SELECT * FROM transactions WHERE date >= '2024-01-01'",
                "data": {"total_transactions": 1000},
                "visualizations": [
                    {
                        "type": "bar",
                        "data": {"labels": ["Jan", "Feb"], "values": [100, 200]},
                        "config": {"title": "Monthly Transactions"},
                    }
                ],
            }
        }
    }

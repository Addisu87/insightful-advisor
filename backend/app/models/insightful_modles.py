from pydantic import BaseModel


class UserQuery(BaseModel):
    question: str
    client_id: str


class InsightResponse(BaseModel):
    summary: str
    sql_query: str
    data: dict
    visualizations: list[str]

# main.py
import google.cloud.bigquery as bq
from app.models.insightful_modles import InsightResponse, UserQuery
from fastapi import APIRouter
from pydantic_ai import Agent

router = APIRouter()
bq_client = bq.Client()


@router.post("/generate-insights")
async def generate_insights(query: UserQuery):
    # Step 1: Structured LLM → SQL
    llm = Agent("openai:gpt-4o")
    sql = await llm.predict(
        f"Convert to BigQuery SQL: {query.question}",
        output_model=SQLQuery,  # PydanticAI schema
    )

    # Step 2: Run BigQuery
    results = bq_client.query(sql.query).to_dataframe()

    # Step 3: Generate insights
    insights = await llm.predict(
        f"Analyze this data: {results.to_dict()}", output_model=InsightResponse
    )

    # Step 4: Store in Supabase
    supabase.table("insights").insert(
        {"user_id": user.id, "query": query.question, "response": insights.model_dump()}
    ).execute()

    return insights

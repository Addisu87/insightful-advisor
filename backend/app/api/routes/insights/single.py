from app.models.insight import InsightResponse
from app.models.query import UserQuery
from app.services.db_service import BigQueryService
from app.services.llm_service import LLMService
from app.services.storage_service import StorageService
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()


@router.post("/generate", response_model=InsightResponse)
async def generate_insights(
    query: UserQuery,
    llm_service: LLMService = Depends(),
    db_service: BigQueryService = Depends(),
    storage_service: StorageService = Depends(),
):
    """Generate insights from a single natural language query."""
    try:
        # Generate SQL with type validation
        sql = await llm_service.generate_sql(query.question)

        # Execute query
        results = await db_service.execute_query(sql)

        # Generate insights with structured output
        insights = await llm_service.generate_insights(results)

        # Store the generated insights
        await storage_service.store_insight(
            client_id=query.client_id, question=query.question, insight=insights
        )

        return insights

    except Exception as e:
        logger.error("Insight generation failed", error=str(e), question=query.question)
        raise HTTPException(status_code=500, detail="Failed to generate insights")

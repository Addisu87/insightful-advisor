from typing import List

from app.core.logging import logger
from app.models.insight import InsightResponse
from app.models.query import UserQuery
from app.services.db_service import BigQueryService
from app.services.llm_service import LLMService
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()


@router.post("/batch", response_model=List[InsightResponse])
async def batch_insights(
    queries: List[UserQuery],
    llm_service: LLMService = Depends(),
    db_service: BigQueryService = Depends(),
):
    """Batch process multiple queries for efficiency."""
    try:
        questions = [q.question for q in queries]
        sql_queries = await llm_service.batch_process(questions)

        # Process results in parallel
        results = await db_service.execute_batch_queries(sql_queries)

        # Generate insights for all results
        insights = []
        for result in results:
            insight = await llm_service.generate_insights(result)
            insights.append(insight)

        return insights

    except Exception as e:
        logger.error("Batch insight generation failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to generate batch insights")

import asyncio
from dataclasses import dataclass
from string import Template
from typing import List

import logfire
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIResponsesModel
from pydantic_ai.usage import Usage

from app.models.insight import InsightResponse
from app.models.sql import SQLQuery
from app.services.db_service import BigQueryService


@dataclass
class Prompt:
    template: str

    def format(self, **kwargs):
        return Template(self.template).safe_substitute(**kwargs)


# Initialize the agent
insight_agent = Agent(
    "openai:gpt-4",
    deps_type=BigQueryService,
    system_prompt="""
    You are an AI analyst that converts natural language questions into SQL 
    and generates insights from data. Follow BigQuery best practices.
    """,
)

# Define prompts
sql_prompt = Prompt("""
Convert this question to a BigQuery SQL query.
Question: {question}
""")

insight_prompt = Prompt("""
Analyze the provided data and generate insights.
Data: {data}
""")


@insight_agent.tool
async def generate_sql(ctx: RunContext[BigQueryService], question: str) -> SQLQuery:
    """Generate SQL query from natural language."""
    logfire.info("Generating SQL query", question=question)
    return SQLQuery(
        query=sql_prompt.format(question=question),
        description=f"Query generated for question: {question}",
    )


@insight_agent.tool
async def generate_insights(
    ctx: RunContext[BigQueryService], data: dict
) -> InsightResponse:
    """Generate insights from query results."""
    logfire.info("Generating insights from data")
    formatted_prompt = insight_prompt.format(data=data)

    return InsightResponse(
        summary=formatted_prompt,
        sql_query="",  # SQL query will be set by the caller
        data=data,
        visualizations=[],  # Empty list as default for visualizations
    )


async def process_single_question(
    question: str, db_service: BigQueryService
) -> InsightResponse:
    """Process a single question through the insight pipeline."""
    # Generate SQL
    context = RunContext[BigQueryService](
        deps=db_service,
        usage=Usage(total_tokens=0),
        prompt=sql_prompt.format(question=question),
        model=OpenAIResponsesModel("gpt-4"),
    )
    sql_result = await generate_sql(context, question)

    # Execute query
    query_results = await db_service.execute_query(sql_result)

    # Generate insights with SQL query included
    insight_context = RunContext[BigQueryService](
        deps=db_service,
        usage=Usage(total_tokens=0),
        prompt=insight_prompt.format(data=query_results),
        model=OpenAIResponsesModel("gpt-4"),
    )
    insights = await generate_insights(insight_context, query_results)

    # Update the SQL query in the insights
    insights.sql_query = sql_result.query

    return insights


async def process_questions(
    questions: List[str], db_service: BigQueryService
) -> List[InsightResponse]:
    """Process multiple questions in parallel."""
    return await asyncio.gather(
        *(process_single_question(q, db_service) for q in questions)
    )

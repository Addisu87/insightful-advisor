import logfire
from google.cloud import bigquery

from app.models.sql import SQLQuery


class BigQueryService:
    def __init__(self):
        self.client = bigquery.Client()

    async def execute_query(self, sql: SQLQuery) -> dict:
        try:
            logfire.info("Executing BigQuery query", sql_query=sql.query)
            results = self.client.query(sql.query).to_dataframe()
            logfire.info("Query execution successful", rows_returned=len(results))
            return results.to_dict()
        except Exception as e:
            logfire.error("Query execution failed", error=str(e))
            raise

import logfire
from postgrest.base_request_builder import APIResponse
from supabase import Client, create_client

from app.core.config import settings
from app.models.insight import InsightResponse


class StorageService:
    def __init__(self):
        self.supabase: Client = create_client(
            settings.VITE_SUPABASE_URL, settings.VITE_SUPABASE_ANON_KEY
        )

    async def store_insight(
        self, client_id: str, question: str, insight: InsightResponse
    ) -> None:
        """Store insight data in Supabase."""
        try:
            logfire.info("Storing insight", client_id=client_id)

            # Convert insight to dict and store in Supabase
            data = {
                "client_id": client_id,
                "question": question,
                "response": insight.model_dump(),
                "created_at": "now()",  # Supabase timestamp
            }

            response: APIResponse = (
                self.supabase.table("insights").insert(data).execute()
            )

            if response.data is None:
                raise Exception("Failed to store insight: No data returned")

            logfire.info("Insight stored successfully")

        except Exception as e:
            logfire.error("Failed to store insight", error=str(e))
            raise

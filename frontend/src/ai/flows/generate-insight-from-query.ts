import { supabase } from "@/lib/supabase"

interface InsightParams {
	question: string
	clientName: string
}

interface InsightResponse {
	query: string
	queryResult: string
	insights: string
}

export async function generateInsightFromQuery({
	question,
	clientName,
}: InsightParams): Promise<InsightResponse> {
	const { data, error } = await supabase.functions.invoke("generate-insights", {
		body: {
			question,
			client_id: clientName,
		},
	})

	if (error) {
		throw new Error(`Failed to generate insights: ${error.message}`)
	}

	return {
		query: data.sql_query || "",
		queryResult: JSON.stringify(data.results, null, 2),
		insights: data.summary,
	}
}

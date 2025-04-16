interface SummaryParams {
	insights: string
}

interface SummaryResponse {
	summary: string
}

export async function summarizeInsights({
	insights,
}: SummaryParams): Promise<SummaryResponse> {
	// For now, return the insights as is - you can implement additional summarization later
	return {
		summary: insights,
	}
}

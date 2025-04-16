import { insightResponseSchema } from "../schemas"
import { supabase } from "./supabase"

export const fetchInsights = async (question: string, clientId: string) => {
	const { data, error } = await supabase.functions.invoke("generate-insights", {
		body: { question, client_id: clientId },
	})

	if (error) throw error

	// Validate response shape
	return insightResponseSchema.parse(data)
}

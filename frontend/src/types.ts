export type Message = {
	id: string
	content: string
	role: "user" | "assistant" | "system"
	client_id: string
	created_at: string
	metadata?: {
		summary: string
		sql_query: string
		data: Record<string, any>
		visualizations: Visualization[]
	}
}

export type Visualization = {
	// Add specific visualization fields based on your backend model
	type: string
	data: Record<string, any>
	config: Record<string, any>
}

export interface RequestBody {
	question: string
	client_id: string
}

export interface ResponseBody {
	summary: string
	sql_query: string
	data: Record<string, any>
	visualizations: Visualization[]
}

export type Message = {
	id: string
	content: string
	role: "user" | "assistant" | "system"
	created_at: string
	metadata?: {
		sql_query?: string
		data?: BigQueryResult[]
	}
}

export type Chat = {
	id: string
	client_id: string
	title: string
	created_at: string
}

export interface RequestBody {
	question: string
	client_id: string
}

export interface ResponseBody {
	summary: string
	sql_query: string
	results: BigQueryResult[]
}

export interface BigQueryResult {
	// Add specific fields based on your data structure
	id: string
	timestamp: string
	value: number
}

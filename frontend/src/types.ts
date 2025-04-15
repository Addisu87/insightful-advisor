export type Message = {
	id: string
	content: string
	role: "user" | "assistant" | "system"
	created_at: string
	metadata?: {
		sql_query?: string
		data?: any
	}
}

export type Chat = {
	id: string
	client_id: string
	title: string
	created_at: string
}

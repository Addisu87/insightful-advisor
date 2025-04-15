import { z } from "zod"

// Message validation schema
export const messageSchema = z.object({
	content: z.string().min(1, "Message cannot be empty").max(1000),
	client_id: z.string().uuid(),
})

// API response schema
export const insightResponseSchema = z.object({
	summary: z.string(),
	sql_query: z.string().optional(),
	data: z.record(z.unknown()).optional(),
})

export type MessageFormData = z.infer<typeof messageSchema>
export type InsightResponse = z.infer<typeof insightResponseSchema>

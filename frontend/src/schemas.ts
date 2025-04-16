import { z } from "zod"

export const visualizationSchema = z.object({
	type: z.string(),
	data: z.record(z.unknown()),
	config: z.record(z.unknown())
})

export const messageSchema = z.object({
	content: z.string().min(1, "Message cannot be empty").max(1000),
	client_id: z.string().uuid(),
})

export const insightResponseSchema = z.object({
	summary: z.string(),
	sql_query: z.string(),
	data: z.record(z.unknown()),
	visualizations: z.array(visualizationSchema)
})

export type MessageFormData = z.infer<typeof messageSchema>
export type InsightResponse = z.infer<typeof insightResponseSchema>
export type Visualization = z.infer<typeof visualizationSchema>

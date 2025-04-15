import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { messageSchema, InsightResponse } from "../schemas"
import { supabase } from "../lib/supabase"
import ReactMarkdown from "react-markdown"
import { Bar } from "react-chartjs-2"
import { useEffect, useRef, useState } from "react"
import { Message } from "../types"
import { MessageFormData } from "../schemas"
import { insightResponseSchema } from "../schemas"

export default function ChatInterface({ clientId }: { clientId: string }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<MessageFormData>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			content: "",
			client_id: clientId,
		},
	})

	const [messages, setMessages] = useState<Message[]>([])
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// Fetch messages and set up realtime (same as before)
	useEffect(() => {
		/* ... */
	}, [clientId])

	const onSubmit = async (formData: MessageFormData) => {
		try {
			// Optimistic update
			const userMessage = {
				id: Date.now().toString(),
				content: formData.content,
				role: "user" as const,
				client_id: clientId,
				created_at: new Date().toISOString(),
			}
			setMessages((prev) => [...prev, userMessage])

			// Save to Supabase
			await supabase.from("messages").insert([userMessage])

			// Get AI response
			const { data, error } = await supabase.functions.invoke("generate-insights", {
				body: { question: formData.content, client_id: clientId },
			})

			if (error) throw error

			// Validate API response
			const parsedResponse = insightResponseSchema.parse(data)

			const aiMessage = {
				id: Date.now().toString(),
				content: parsedResponse.summary,
				role: "assistant" as const,
				client_id: clientId,
				created_at: new Date().toISOString(),
				metadata: {
					sql_query: parsedResponse.sql_query,
					data: parsedResponse.data,
				},
			}

			await supabase.from("messages").insert([aiMessage])
			reset()
		} catch (error) {
			console.error("Submission error:", error)
			setMessages((prev) => [
				...prev,
				{
					id: `error-${Date.now()}`,
					content: "Failed to get response. Please try again.",
					role: "system",
					created_at: new Date().toISOString(),
				},
			])
		}
	}

	return (
		<div className="flex flex-col h-full max-w-4xl mx-auto">
			{/* Message History (same as before) */}

			{/* Enhanced Form with Validation */}
			<form onSubmit={handleSubmit(onSubmit)} className="p-4 border-t" noValidate>
				<div className="flex flex-col space-y-2">
					<div className="flex space-x-2">
						<input
							{...register("content")}
							disabled={isSubmitting}
							className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none ${
								errors.content ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
							}`}
							placeholder="Ask about client data..."
						/>
						<button
							type="submit"
							disabled={isSubmitting}
							className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
						>
							{isSubmitting ? "Sending..." : "Send"}
						</button>
					</div>
					{errors.content && (
						<p className="text-red-500 text-sm">{errors.content.message}</p>
					)}
				</div>
			</form>
		</div>
	)
}

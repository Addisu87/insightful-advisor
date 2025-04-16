import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { messageSchema, type MessageFormData } from "@/schemas"
import { supabase } from "@/lib/supabase"
import { useEffect, useRef, useState } from "react"
import type { Message } from "@/types"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { generateInsightFromQuery } from "@/ai/flows/generate-insight-from-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatMessage extends Message {
	isLoading?: boolean
}

interface ChatInterfaceProps {
	clientId: string
}

export default function ChatInterface({ clientId }: ChatInterfaceProps) {
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

	const [messages, setMessages] = useState<ChatMessage[]>([])
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const { data, error } = await supabase
					.from("messages")
					.select("*")
					.eq("client_id", clientId)
					.order("created_at", { ascending: true })

				if (error) {
					console.error("Supabase error:", error)
					toast.error("Error fetching messages", {
						description: error.message || "Please check your connection and try again",
					})
					return
				}

				setMessages(data || [])
			} catch (err) {
				console.error("Fetch error:", err)
				toast.error("Failed to fetch messages", {
					description: "Please check your connection and try again",
				})
			}
		}

		fetchMessages()

		// Real-time subscriptions
		const channel = supabase
			.channel("messages")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `client_id=eq.${clientId}`,
				},
				(payload) => {
					setMessages((prev) => [...prev, payload.new as Message])
				},
			)
			.subscribe((status) => {
				if (status === "SUBSCRIBED") {
					console.log("Subscribed to messages channel")
				}
				if (status === "CHANNEL_ERROR") {
					console.error("Failed to subscribe to messages channel")
					toast.error("Real-time updates unavailable", {
						description: "Messages may not update automatically",
					})
				}
			})

		return () => {
			supabase.removeChannel(channel)
		}
	}, [clientId])

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [messages])

	const onSubmit = async (formData: MessageFormData) => {
		try {
			// Add user message with loading state
			const userMessage: ChatMessage = {
				id: Date.now().toString(),
				content: formData.content,
				role: "user",
				client_id: clientId,
				created_at: new Date().toISOString(),
			}

			setMessages((prev) => [...prev, userMessage])

			// Save user message to Supabase
			const { error: userMessageError } = await supabase
				.from("messages")
				.insert([userMessage])

			if (userMessageError) throw userMessageError

			// Generate AI response
			const { insights, query, queryResult } = await generateInsightFromQuery({
				question: formData.content,
				clientName: clientId,
			})

			const aiMessage: ChatMessage = {
				id: Date.now().toString(),
				content: insights,
				role: "assistant",
				client_id: clientId,
				created_at: new Date().toISOString(),
				metadata: {
					sql_query: query,
					data: JSON.parse(queryResult),
				},
			}

			// Save AI message to Supabase
			const { error: aiMessageError } = await supabase
				.from("messages")
				.insert([aiMessage])

			if (aiMessageError) throw aiMessageError

			reset()
		} catch (error) {
			console.error("Submission error:", error)
			toast.error("Failed to get response", {
				description: "Please try again.",
			})

			setMessages((prev) => [
				...prev,
				{
					id: `error-${Date.now()}`,
					content: "Failed to get response. Please try again.",
					role: "system",
					client_id: clientId,
					created_at: new Date().toISOString(),
				},
			])
		}
	}

	return (
		<Card className="flex flex-col h-[600px]">
			<CardContent className="flex flex-col h-full p-4">
				<div className="flex-1 overflow-y-auto space-y-4 mb-4">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${
								message.role === "user" ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`max-w-[80%] rounded-lg p-3 ${
									message.role === "user"
										? "bg-primary text-primary-foreground"
										: message.role === "system"
										? "bg-destructive/10 text-destructive"
										: "bg-muted"
								}`}
							>
								<p>{message.content}</p>
								{message.metadata?.sql_query && (
									<pre className="mt-2 text-sm bg-muted-foreground/20 p-2 rounded overflow-x-auto">
										{message.metadata.sql_query}
									</pre>
								)}
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="mt-auto">
					<div className="flex flex-col space-y-2">
						<div className="flex space-x-2">
							<Input
								{...register("content")}
								disabled={isSubmitting}
								className={errors.content ? "border-destructive" : ""}
								placeholder="Ask about client data..."
							/>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Sending..." : "Send"}
							</Button>
						</div>
						{errors.content && (
							<p className="text-destructive text-sm">{errors.content.message}</p>
						)}
					</div>
				</form>
			</CardContent>
		</Card>
	)
}

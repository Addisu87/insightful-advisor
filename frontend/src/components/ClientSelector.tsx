import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

interface Client {
	value: string
	label: string
}

interface ClientSelectorProps {
	clients: Client[]
	selectedClient: string
	onClientChange: (value: string) => void
}

export default function ClientSelector({
	clients,
	selectedClient,
	onClientChange,
}: ClientSelectorProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Insightful Advisor</CardTitle>
				<CardDescription>Select a client to start the conversation.</CardDescription>
			</CardHeader>
			<CardContent>
				<Select onValueChange={onClientChange} defaultValue={selectedClient}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select client" />
					</SelectTrigger>
					<SelectContent>
						{clients.map((client) => (
							<SelectItem key={client.value} value={client.value}>
								{client.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardContent>
		</Card>
	)
}

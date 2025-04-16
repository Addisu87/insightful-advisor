import { useState } from "react"
import { Toaster } from "./components/ui/sonner"
import ChatInterface from "./components/ChatInterface"
import ClientSelector from "./components/ClientSelector"
import Layout from "./components/Layout"
import { MOCK_CLIENTS } from "./constants/clients"

export default function App() {
	const [clientName, setClientName] = useState(MOCK_CLIENTS[0].value)

	return (
		<Layout>
			<Toaster />
			<ClientSelector
				clients={MOCK_CLIENTS}
				selectedClient={clientName}
				onClientChange={setClientName}
			/>
			{clientName && <ChatInterface clientId={clientName} />}
		</Layout>
	)
}

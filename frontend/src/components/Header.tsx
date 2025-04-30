import { SidebarTrigger } from "@/components/ui/sidebar"

export function Header() {
	return (
		<header className="bg-background flex h-14 items-center gap-4 border-b px-4 lg:px-6">
			<SidebarTrigger />
			<h1 className="text-xl font-semibold">Insightful Advisor</h1>
		</header>
	)
}

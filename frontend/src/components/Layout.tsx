import {
	SidebarProvider,
	SidebarInset,
	Sidebar,
	SidebarContent,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/Header"

interface LayoutProps {
	children: React.ReactNode
	className?: string
}

export default function Layout({ children }: LayoutProps) {
	return (
		<SidebarProvider defaultOpen>
			<AppSidebar />
			{/* Add SidebarInset to handle the content area properly */}
			<SidebarInset>
				<div className="flex h-full w-full flex-col">
					<Header />
					<main className="flex-1">
						<div className="h-full p-4 lg:p-6 flex flex-col gap-4">{children}</div>
					</main>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

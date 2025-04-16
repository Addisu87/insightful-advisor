import { cn } from "@/lib/utils"
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

export default function Layout({ children, className }: LayoutProps) {
	return (
		<SidebarProvider defaultOpen>
			<div className={cn("flex min-h-screen bg-background", className)}>
				<AppSidebar />
				<div className="flex w-full flex-col">
					<Header />
					<main className="flex-1">
						<div className="h-full p-4 lg:p-6 flex flex-col gap-4">{children}</div>
					</main>
				</div>
			</div>
		</SidebarProvider>
	)
}

import {
	Home,
	Search,
	LineChart,
	BarChart3,
	Settings,
	CreditCard,
	User,
	LogOut,
	ChevronUp,
	ChevronDown,
	Plus,
	Brain,
	TrendingUp,
	History,
	Database,
	MessageSquare,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { cn } from "@/lib/utils"

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarHeader,
	SidebarFooter,
} from "@/components/ui/sidebar"

// Main navigation items
const mainItems = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: Home,
	},
	{
		title: "Chat Interface",
		url: "/chat",
		icon: MessageSquare,
	},
	{
		title: "Search Insights",
		url: "/search",
		icon: Search,
	},
]

// Analytics items
const analyticsItems = [
	{
		title: "Data Analysis",
		url: "/analysis",
		icon: LineChart,
	},
	{
		title: "Industry Trends",
		url: "/trends",
		icon: TrendingUp,
	},
	{
		title: "Performance Metrics",
		url: "/metrics",
		icon: BarChart3,
	},
]

// AI Tools items
const aiToolsItems = [
	{
		title: "Generate Insights",
		url: "/generate",
		icon: Brain,
	},
	{
		title: "Query History",
		url: "/history",
		icon: History,
	},
	{
		title: "Data Sources",
		url: "/sources",
		icon: Database,
	},
]

export function AppSidebar() {
	const [open, setOpen] = useState(false)
	const [analyticsOpen, setAnalyticsOpen] = useState(true)
	const [aiToolsOpen, setAiToolsOpen] = useState(true)

	const handleLogout = () => {
		// Implement logout logic here
		console.log("Logging out...")
	}

	return (
		<Sidebar>
			<SidebarHeader className="border-b">
				<div className="flex items-center gap-3 px-2">
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>IA</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium">Insightful Advisor</span>
						<span className="text-xs text-muted-foreground">AI based</span>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{mainItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon className="h-4 w-4" />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Analytics - collapsible */}
				<SidebarGroup>
					<button
						onClick={() => setAnalyticsOpen(!analyticsOpen)}
						className={cn(
							"flex w-full items-center justify-between px-2 py-2",
							"hover:bg-accent hover:text-accent-foreground rounded-md",
						)}
					>
						<div className="flex items-center gap-2">
							<LineChart className="h-4 w-4" />
							<span className="text-sm font-medium">Analytics</span>
						</div>
						<div className="relative h-4 w-4">
							<ChevronDown
								className={cn(
									"absolute h-4 w-4 text-muted-foreground transition-all",
									analyticsOpen && "rotate-180",
								)}
							/>
						</div>
					</button>
					<div
						className={cn(
							"grid transition-all",
							analyticsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
						)}
					>
						<div className="overflow-hidden">
							<SidebarGroupContent>
								<SidebarMenu>
									{analyticsItems.map((item) => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton asChild>
												<a href={item.url}>
													<item.icon className="h-4 w-4" />
													<span>{item.title}</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</div>
					</div>
				</SidebarGroup>

				{/* AI Tools - collapsible */}
				<SidebarGroup>
					<button
						onClick={() => setAiToolsOpen(!aiToolsOpen)}
						className={cn(
							"flex w-full items-center justify-between px-2 py-2",
							"hover:bg-accent hover:text-accent-foreground rounded-md",
						)}
					>
						<div className="flex items-center gap-2">
							<Brain className="h-4 w-4" />
							<span className="text-sm font-medium">AI Tools</span>
						</div>
						<div className="relative h-4 w-4">
							<ChevronDown
								className={cn(
									"absolute h-4 w-4 text-muted-foreground transition-all",
									aiToolsOpen && "rotate-180",
								)}
							/>
						</div>
					</button>
					<div
						className={cn(
							"grid transition-all",
							aiToolsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
						)}
					>
						<div className="overflow-hidden">
							<SidebarGroupContent>
								<SidebarMenu>
									{aiToolsItems.map((item) => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton asChild>
												<a href={item.url}>
													<item.icon className="h-4 w-4" />
													<span>{item.title}</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</div>
					</div>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="border-t">
				<DropdownMenu open={open} onOpenChange={setOpen}>
					<DropdownMenuTrigger asChild>
						<div className="flex cursor-pointer items-center justify-between px-2 py-2 hover:bg-accent hover:text-accent-foreground">
							<div className="flex items-center gap-3">
								<Avatar className="h-9 w-9">
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>JD</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="text-sm font-medium">John Doe</span>
									<span className="text-xs text-muted-foreground">
										john@example.com
									</span>
								</div>
							</div>
							<ChevronDown
								className={cn(
									"h-4 w-4 text-muted-foreground transition-transform duration-200",
									open && "rotate-180",
								)}
							/>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="start" side="right">
						<DropdownMenuItem>
							<User className="mr-2 h-4 w-4" />
							<span>Account</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<CreditCard className="mr-2 h-4 w-4" />
							<span>Billing</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut className="mr-2 h-4 w-4" />
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarFooter>
		</Sidebar>
	)
}

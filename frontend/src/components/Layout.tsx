import { cn } from "@/lib/utils"

interface LayoutProps {
	children: React.ReactNode
	className?: string
}

export default function Layout({ children, className }: LayoutProps) {
	return (
		<div className={cn("container mx-auto p-4 flex flex-col gap-4", className)}>
			{children}
		</div>
	)
}

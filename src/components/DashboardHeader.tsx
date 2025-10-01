import { SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar } from "lucide-react";

export function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-card">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="h-8 w-px bg-border" />
        <h1 className="text-xl font-semibold text-foreground">Performance Analytics</h1>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>{currentDate}</span>
      </div>
    </header>
  );
}

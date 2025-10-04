import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

interface ProductSelectorProps {
  selectedProduct: string;
  onProductChange: (value: string) => void;
  selectedVersion: string;
  onVersionChange: (value: string) => void;
  reportingType: string;
  onReportingTypeChange: (value: string) => void;
}

interface DashboardLayoutProps {
  children: ReactNode;
  productSelectorProps?: ProductSelectorProps;
}

export function DashboardLayout({ children, productSelectorProps }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar productSelectorProps={productSelectorProps} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

import { BarChart3, FileText, TrendingUp, ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ProductSelector } from "./ProductSelector";

const navigationItems = [
  { title: "Tear Sheet", url: "/tearsheet", icon: FileText },
  { title: "Frequency Insights", url: "/insights", icon: TrendingUp },
];

interface DashboardSidebarProps {
  productSelectorProps?: {
    selectedProduct: string;
    onProductChange: (value: string) => void;
    selectedVersion: string;
    onVersionChange: (value: string) => void;
    reportingType: "daily" | "chained" | "tranching";
    onReportingTypeChange: (value: "daily" | "chained" | "tranching") => void;
  };
}

export function DashboardSidebar({ productSelectorProps }: DashboardSidebarProps) {
  const { open } = useSidebar();
  const location = useLocation();
  const isProductsPage = location.pathname === "/";
  const [isProductsOpen, setIsProductsOpen] = useState(isProductsPage);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          {open ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">IA</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">InvestorAI</h2>
                <p className="text-xs text-muted-foreground">Performance Dashboard</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto">
              <span className="text-xl font-bold text-primary-foreground">IA</span>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible open={isProductsOpen} onOpenChange={setIsProductsOpen}>
                <SidebarMenuItem>
                  <div className="flex items-center w-full">
                    <SidebarMenuButton asChild isActive={isProductsPage} className="flex-1">
                      <NavLink to="/" className="transition-smooth">
                        <BarChart3 className="h-4 w-4" />
                        <span>Products</span>
                      </NavLink>
                    </SidebarMenuButton>
                    <CollapsibleTrigger asChild>
                      <button 
                        className="p-2 hover:bg-sidebar-accent rounded-md transition-smooth"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsProductsOpen(!isProductsOpen);
                        }}
                      >
                        <ChevronDown 
                          className={`h-4 w-4 text-sidebar-foreground transition-transform ${
                            isProductsOpen ? "transform rotate-180" : ""
                          }`} 
                        />
                      </button>
                    </CollapsibleTrigger>
                  </div>
                </SidebarMenuItem>
                {isProductsPage && productSelectorProps && (
                  <CollapsibleContent>
                    <ProductSelector {...productSelectorProps} />
                  </CollapsibleContent>
                )}
              </Collapsible>
              
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url} className="transition-smooth">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

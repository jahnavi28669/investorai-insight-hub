import { BarChart3, FileText, TrendingUp, ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { ProductSelector } from "./ProductSelector";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navigationItems = [
  { title: "Products", url: "/", icon: BarChart3 },
  { title: "Tear Sheet", url: "/tearsheet", icon: FileText },
  { title: "Frequency Insights", url: "/insights", icon: TrendingUp },
];

interface ProductSelectorProps {
  selectedProduct: string;
  onProductChange: (value: string) => void;
  selectedVersion: string;
  onVersionChange: (value: string) => void;
  reportingType: string;
  onReportingTypeChange: (value: string) => void;
}

interface DashboardSidebarProps {
  productSelectorProps?: ProductSelectorProps;
}

export function DashboardSidebar({ productSelectorProps }: DashboardSidebarProps) {
  const { open } = useSidebar();
  const location = useLocation();
  const [productsExpanded, setProductsExpanded] = useState(location.pathname === "/");

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
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                const isProducts = item.title === "Products";
                
                if (isProducts && open) {
                  return (
                    <Collapsible
                      key={item.title}
                      open={productsExpanded}
                      onOpenChange={setProductsExpanded}
                    >
                      <SidebarMenuItem>
                        <div className="flex items-center w-full">
                          <SidebarMenuButton asChild isActive={isActive} className="flex-1">
                            <NavLink to={item.url} className="transition-smooth">
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuButton>
                          <CollapsibleTrigger asChild>
                            <button className="p-1 hover:bg-accent rounded-sm mr-2">
                              <ChevronDown className={`h-4 w-4 transition-transform ${productsExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </CollapsibleTrigger>
                        </div>
                      </SidebarMenuItem>
                      <CollapsibleContent>
                        {productSelectorProps && isActive && (
                          <div className="pl-2 pt-2 pb-2">
                            <ProductSelector {...productSelectorProps} />
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }
                
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

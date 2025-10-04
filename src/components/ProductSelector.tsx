import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ProductSelectorProps {
  selectedProduct: string;
  onProductChange: (value: string) => void;
  selectedVersion: string;
  onVersionChange: (value: string) => void;
  reportingType: "daily" | "chained" | "tranching";
  onReportingTypeChange: (value: "daily" | "chained" | "tranching") => void;
}

const products = [
  "Alpha Titan",
  "Momentum 250",
  "Sector Navigator",
  "HDFC Long",
  "MTF 30D Long",
  "YES Long",
  "US AMC 7D Long",
];

const versions = ["v1 (Production)", "v2 (Contender)", "v3 (Contender)", "v4 (Contender)", "v5 (Contender)"];

export function ProductSelector({
  selectedProduct,
  onProductChange,
  selectedVersion,
  onVersionChange,
  reportingType,
  onReportingTypeChange,
}: ProductSelectorProps) {
  const reportingTypes: Array<{ value: "daily" | "chained" | "tranching"; label: string }> = [
    { value: "daily", label: "Daily" },
    { value: "chained", label: "Chained" },
    { value: "tranching", label: "Tranching" },
  ];

  return (
    <div className="space-y-3 px-4 pb-4">
      <div className="space-y-2">
        <Label htmlFor="product" className="text-xs font-medium text-sidebar-foreground">
          Select Product
        </Label>
        <Select value={selectedProduct} onValueChange={onProductChange}>
          <SelectTrigger id="product" className="h-9 bg-sidebar-accent border-sidebar-border text-sm">
            <SelectValue placeholder="Choose a product" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            {products.map((product) => (
              <SelectItem key={product} value={product}>
                {product}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="version" className="text-xs font-medium text-sidebar-foreground">
          Model Version
        </Label>
        <Select value={selectedVersion} onValueChange={onVersionChange}>
          <SelectTrigger id="version" className="h-9 bg-sidebar-accent border-sidebar-border text-sm">
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            {versions.map((version) => (
              <SelectItem key={version} value={version}>
                {version}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-sidebar-foreground">
          Reporting Type
        </Label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-sidebar-accent rounded-md">
          {reportingTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onReportingTypeChange(type.value)}
              className={`px-2 py-1.5 text-xs font-medium rounded transition-smooth ${
                reportingType === type.value
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent-foreground/10"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

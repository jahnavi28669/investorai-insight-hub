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
  selectedReportType: string;
  onReportTypeChange: (value: string) => void;
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

const reportTypes = ["Daily", "Chained", "Tranching"];

export function ProductSelector({
  selectedProduct,
  onProductChange,
  selectedVersion,
  onVersionChange,
  selectedReportType,
  onReportTypeChange,
}: ProductSelectorProps) {
  return (
    <div className="flex flex-col gap-6 p-6 bg-card border-r border-border h-full">
      <div className="space-y-2">
        <Label htmlFor="product" className="text-sm font-medium text-foreground">
          Select Product
        </Label>
        <Select value={selectedProduct} onValueChange={onProductChange}>
          <SelectTrigger id="product" className="bg-secondary border-border">
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
        <Label htmlFor="version" className="text-sm font-medium text-foreground">
          Model Version
        </Label>
        <Select value={selectedVersion} onValueChange={onVersionChange}>
          <SelectTrigger id="version" className="bg-secondary border-border">
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
        <Label htmlFor="reportType" className="text-sm font-medium text-foreground">
          Reporting Type
        </Label>
        <p className="text-xs text-muted-foreground mb-2">Choose your analysis perspective</p>
        <Select value={selectedReportType} onValueChange={onReportTypeChange}>
          <SelectTrigger id="reportType" className="bg-secondary border-border">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            {reportTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

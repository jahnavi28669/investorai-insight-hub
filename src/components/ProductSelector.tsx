import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ProductSelectorProps {
  selectedProduct: string;
  onProductChange: (value: string) => void;
  selectedVersion: string;
  onVersionChange: (value: string) => void;
  reportingType: string;
  onReportingTypeChange: (value: string) => void;
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

const reportingTypes = ["daily", "chained", "tranching"];

export function ProductSelector({
  selectedProduct,
  onProductChange,
  selectedVersion,
  onVersionChange,
  reportingType,
  onReportingTypeChange,
}: ProductSelectorProps) {
  return (
    <div className="space-y-4 px-2">
      <div className="space-y-2">
        <Label htmlFor="product" className="text-xs font-medium text-muted-foreground">
          Select Product
        </Label>
        <Select value={selectedProduct} onValueChange={onProductChange}>
          <SelectTrigger id="product" className="h-9 text-sm bg-secondary border-border">
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
        <Label htmlFor="version" className="text-xs font-medium text-muted-foreground">
          Model Version
        </Label>
        <Select value={selectedVersion} onValueChange={onVersionChange}>
          <SelectTrigger id="version" className="h-9 text-sm bg-secondary border-border">
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
        <Label className="text-xs font-medium text-muted-foreground">
          Reporting Type
        </Label>
        <div className="flex flex-col gap-1">
          {reportingTypes.map((type) => (
            <Button
              key={type}
              variant={reportingType === type ? "secondary" : "ghost"}
              size="sm"
              className="justify-start h-8 text-sm"
              onClick={() => onReportingTypeChange(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

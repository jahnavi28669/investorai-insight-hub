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
}: ProductSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-card rounded-xl border border-border shadow-card">
      <div className="space-y-2">
        <Label htmlFor="product" className="text-sm font-medium text-foreground">
          Select Product
        </Label>
        <Select value={selectedProduct} onValueChange={onProductChange}>
          <SelectTrigger id="product" className="bg-secondary border-border">
            <SelectValue placeholder="Choose a product" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
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
          <SelectContent className="bg-popover border-border">
            {versions.map((version) => (
              <SelectItem key={version} value={version}>
                {version}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

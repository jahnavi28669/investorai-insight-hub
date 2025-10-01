import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TearSheet() {
  return (
    <div className="space-y-6">
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">Tear Sheet Overview</CardTitle>
          <CardDescription className="text-muted-foreground">
            Comprehensive performance summary across all products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            Consolidated tear sheet view with all products and time periods
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

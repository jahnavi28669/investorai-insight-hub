import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FrequencyInsights() {
  return (
    <div className="space-y-6">
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">Frequency Insights</CardTitle>
          <CardDescription className="text-muted-foreground">
            Rebalancing frequency analysis and optimization recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            Frequency analysis charts and recommendations
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

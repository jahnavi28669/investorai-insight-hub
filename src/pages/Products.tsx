import { useState } from "react";
import { ProductSelector } from "@/components/ProductSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AggregateMetrics } from "@/components/AggregateMetrics";
import { AnalysisSelector } from "@/components/AnalysisSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState("Alpha Titan");
  const [selectedVersion, setSelectedVersion] = useState("v1 (Production)");
  const [reportingType, setReportingType] = useState<"daily" | "chained" | "tranching">("daily");
  const [basketAnalysis, setBasketAnalysis] = useState("portfolio-benchmark");
  const [tickerAnalysis, setTickerAnalysis] = useState("top-performers");

  // Mock data
  const aggregateData = {
    beatRatio: 0.68,
    avgBasketReturn: 0.0245,
    basketVolatility: 0.0156,
    numberOfBaskets: 24,
    avgDrawdown: -0.0312,
    winRatio: 0.72,
  };

  const basketOptions = [
    { value: "portfolio-benchmark", label: "Portfolio vs Benchmark" },
    { value: "individual-performance", label: "Individual Basket Performance" },
  ];

  const tickerOptions = [
    { value: "top-performers", label: "Top Performers" },
    { value: "worst-performers", label: "Worst Performers" },
    { value: "sector-analysis", label: "Sector Analysis" },
    { value: "individual-ticker", label: "Individual Ticker Performance" },
  ];

  const productionInfo = {
    product: selectedProduct,
    benchmarkIndex: "NIFTY 100",
    inceptionDate: "2023-01-15",
    numberOfStocks: 25,
    rebalanceFrequency: "Weekly",
    partners: "HDFC, YES Bank",
  };

  const mockBasketData = [
    { date: "2024-01-15", basketReturn: 2.4, indexReturn: 1.8 },
    { date: "2024-01-22", basketReturn: -1.2, indexReturn: -0.8 },
    { date: "2024-01-29", basketReturn: 3.1, indexReturn: 2.2 },
  ];

  return (
    <div className="space-y-6">
      <ProductSelector
        selectedProduct={selectedProduct}
        onProductChange={setSelectedProduct}
        selectedVersion={selectedVersion}
        onVersionChange={setSelectedVersion}
      />

      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Reporting Type</CardTitle>
          <CardDescription className="text-muted-foreground">
            Choose your analysis perspective
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={reportingType} onValueChange={(v) => setReportingType(v as any)}>
            <TabsList className="bg-secondary">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="chained">Chained</TabsTrigger>
              <TabsTrigger value="tranching">Tranching</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Tabs defaultValue="aggregate" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="aggregate">Aggregate</TabsTrigger>
          <TabsTrigger value="basket">Basket</TabsTrigger>
          {reportingType !== "tranching" && <TabsTrigger value="tickers">Tickers</TabsTrigger>}
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="production">Production Info</TabsTrigger>
          {reportingType !== "daily" && <TabsTrigger value="tearsheet">Tear Sheet</TabsTrigger>}
        </TabsList>

        <TabsContent value="aggregate" className="space-y-4">
          <AggregateMetrics {...aggregateData} />
        </TabsContent>

        <TabsContent value="basket" className="space-y-4">
          <AnalysisSelector
            value={basketAnalysis}
            onChange={setBasketAnalysis}
            options={basketOptions}
            label="Select Analysis"
          />
          
          {basketAnalysis === "portfolio-benchmark" && (
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Portfolio vs Benchmark Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  Chart: Bar graph showing portfolio vs benchmark returns by date
                </div>
              </CardContent>
            </Card>
          )}

          {basketAnalysis === "individual-performance" && (
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Individual Basket Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-foreground">Date</TableHead>
                      <TableHead className="text-foreground">Basket Return (%)</TableHead>
                      <TableHead className="text-foreground">Index Return (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBasketData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-foreground">{row.date}</TableCell>
                        <TableCell className={row.basketReturn > 0 ? "text-success" : "text-destructive"}>
                          {row.basketReturn.toFixed(2)}%
                        </TableCell>
                        <TableCell className={row.indexReturn > 0 ? "text-success" : "text-destructive"}>
                          {row.indexReturn.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tickers" className="space-y-4">
          <AnalysisSelector
            value={tickerAnalysis}
            onChange={setTickerAnalysis}
            options={tickerOptions}
            label="Select Analysis"
          />
          
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground capitalize">
                {tickerAnalysis.replace("-", " ")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                {tickerAnalysis === "individual-ticker" 
                  ? "Table: Individual ticker performance data"
                  : "Chart: Bar graph for selected analysis"}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Performance Insights</CardTitle>
              <CardDescription className="text-muted-foreground">
                Key findings and model recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-foreground">
                <p>• Portfolio consistently outperforms benchmark with 68% beat ratio</p>
                <p>• Average basket return of 2.45% demonstrates strong alpha generation</p>
                <p>• Volatility remains controlled at 1.56%, indicating disciplined risk management</p>
                <p>• Drawdown metrics suggest resilient performance during market corrections</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Production Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="text-lg font-semibold text-foreground">{productionInfo.product}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Benchmark Index</p>
                  <p className="text-lg font-semibold text-foreground">{productionInfo.benchmarkIndex}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inception Date</p>
                  <p className="text-lg font-semibold text-foreground">{productionInfo.inceptionDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Number of Stocks</p>
                  <p className="text-lg font-semibold text-foreground">{productionInfo.numberOfStocks}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rebalance Frequency</p>
                  <p className="text-lg font-semibold text-foreground">{productionInfo.rebalanceFrequency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Partners</p>
                  <p className="text-lg font-semibold text-foreground">{productionInfo.partners}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {reportingType !== "daily" && (
          <TabsContent value="tearsheet" className="space-y-4">
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Tear Sheet</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Performance comparison across time periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-foreground">Period</TableHead>
                      <TableHead className="text-foreground">Portfolio</TableHead>
                      <TableHead className="text-foreground">Benchmark</TableHead>
                      <TableHead className="text-foreground">Difference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {["1 Day", "1 Month", "3 Months", "6 Months", "1 Year", "Life Time"].map((period) => (
                      <TableRow key={period}>
                        <TableCell className="text-foreground font-medium">{period}</TableCell>
                        <TableCell className="text-success">+5.2%</TableCell>
                        <TableCell className="text-foreground">+3.8%</TableCell>
                        <TableCell className="text-success">+1.4%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

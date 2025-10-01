import { useState, useEffect } from "react";
import { ProductSelector } from "@/components/ProductSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AggregateMetrics } from "@/components/AggregateMetrics";
import { AnalysisSelector } from "@/components/AnalysisSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { loadPortfolioData, getTopPerformers, getWorstPerformers, getSectorAnalysis } from "@/services/portfolioDataService";
import type { AggregateMetrics as AggregateData, BasketData, TickerData } from "@/services/portfolioDataService";

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState("Alpha Titan");
  const [selectedVersion, setSelectedVersion] = useState("v1 (Production)");
  const [reportingType, setReportingType] = useState<"daily" | "chained" | "tranching">("daily");
  const [basketAnalysis, setBasketAnalysis] = useState("portfolio-benchmark");
  const [tickerAnalysis, setTickerAnalysis] = useState("top-performers");
  
  const [aggregateData, setAggregateData] = useState<AggregateData | null>(null);
  const [basketData, setBasketData] = useState<BasketData[]>([]);
  const [tickerData, setTickerData] = useState<TickerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await loadPortfolioData('/src/data/hdfc-long-daily.xlsx');
      if (data) {
        setAggregateData(data.aggregate);
        setBasketData(data.basket);
        setTickerData(data.ticker);
      }
      setLoading(false);
    }
    loadData();
  }, []);

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

  const topPerformers = getTopPerformers(tickerData, 10);
  const worstPerformers = getWorstPerformers(tickerData, 10);
  const sectorAnalysis = getSectorAnalysis(tickerData);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading portfolio data...</div>
      </div>
    );
  }

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
          {aggregateData && <AggregateMetrics {...aggregateData} />}
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
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={basketData.slice(0, 20)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="basketReturn" fill="hsl(var(--primary))" name="Portfolio Return (%)" />
                    <Bar dataKey="indexReturn" fill="hsl(var(--secondary))" name="Index Return (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {basketAnalysis === "individual-performance" && (
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Individual Basket Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-foreground sticky top-0 bg-card">Date</TableHead>
                        <TableHead className="text-foreground sticky top-0 bg-card">Basket Return (%)</TableHead>
                        <TableHead className="text-foreground sticky top-0 bg-card">Index Return (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {basketData.map((row, idx) => (
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
                </div>
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
              {tickerAnalysis === "top-performers" && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topPerformers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="ticker" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="return" fill="hsl(var(--success))" name="Return (%)" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {tickerAnalysis === "worst-performers" && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={worstPerformers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="ticker" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="return" fill="hsl(var(--destructive))" name="Return (%)" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {tickerAnalysis === "sector-analysis" && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={sectorAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="sector" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="avgReturn" fill="hsl(var(--primary))" name="Avg Return (%)" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {tickerAnalysis === "individual-ticker" && (
                <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-foreground sticky top-0 bg-card">Ticker</TableHead>
                        <TableHead className="text-foreground sticky top-0 bg-card">Date</TableHead>
                        <TableHead className="text-foreground sticky top-0 bg-card">Return (%)</TableHead>
                        <TableHead className="text-foreground sticky top-0 bg-card">Sector</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickerData.slice(0, 100).map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-foreground font-medium">{row.ticker}</TableCell>
                          <TableCell className="text-foreground">{row.date}</TableCell>
                          <TableCell className={row.return > 0 ? "text-success" : "text-destructive"}>
                            {row.return.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{row.gicsSector}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
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

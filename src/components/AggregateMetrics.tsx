import { TrendingUp, Target, Activity, Layers, TrendingDown, BarChart3 } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface AggregateMetricsProps {
  beatRatio: number;          // e.g. 0.302 for 30.2%
  winRatio: number;           // e.g. 0.492 for 49.2%
  totalBaskets: number;       // e.g. 63
  avgBasketReturn: number;    // e.g. 0.0015 for 0.15%
  basketVolatility: number;   // e.g. 0.0246 for 2.46%
  avgDrawdown: number;        // e.g. -0.0311 for -3.11%
}

export function AggregateMetrics({
  beatRatio,
  winRatio,
  totalBaskets,
  avgBasketReturn,
  basketVolatility,
  avgDrawdown,
}: AggregateMetricsProps) {
  // ✅ Compute counts automatically
  const winCount = Math.round(winRatio * totalBaskets);
  const beatCount = Math.round(beatRatio * totalBaskets);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Win Ratio */}
      <MetricCard
        title="Win Ratio"
        value={`${(winRatio * 100).toFixed(1)}% (${winCount}/${totalBaskets})`}
        icon={TrendingUp}
        trend={winRatio > 0.5 ? "up" : "down"}
        subtitle="Positive Returns"
      />

      {/* Beat Ratio */}
      <MetricCard
        title="Beat Ratio"
        value={`${(beatRatio * 100).toFixed(1)}% (${beatCount}/${totalBaskets})`}
        icon={Target}
        trend={beatRatio > 0.5 ? "up" : "down"}
        subtitle="vs Benchmark"
      />

      {/* Average Basket Return */}
      <MetricCard
        title="Average Basket Return"
        value={`${(avgBasketReturn * 100).toFixed(2)}%`}
        icon={BarChart3}
        trend={avgBasketReturn > 0 ? "up" : "down"}
      />

      {/* Basket Volatility */}
      <MetricCard
        title="Basket Volatility"
        value={`${(basketVolatility * 100).toFixed(2)}%`}
        icon={Activity}
        trend="neutral"
        subtitle="Risk Measure"
      />

      {/* Number of Baskets */}
      <MetricCard
        title="Number of Baskets"
        value={totalBaskets}
        icon={Layers}
        trend="neutral"
        subtitle="Rebalancing Periods"
      />

      {/* Average Drawdown */}
      <MetricCard
        title="Average Drawdown"
        value={`${(avgDrawdown * 100).toFixed(2)}%`}
        icon={TrendingDown}
        trend={avgDrawdown < 0 ? "down" : "neutral"} 
        subtitle="Max Loss from Peak"
      />
    </div>
  );
}

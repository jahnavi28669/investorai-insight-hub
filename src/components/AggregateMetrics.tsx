import { TrendingUp, Target, Activity, Layers, TrendingDown, BarChart3 } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface AggregateMetricsProps {
  beatRatio: number;
  beatCount: number;
  winRatio: number;
  winCount: number;
  totalBaskets: number;
  avgBasketReturn: number;
  basketVolatility: number;
  avgDrawdown: number;
}

export function AggregateMetrics({
  beatRatio,
  beatCount,
  winRatio,
  winCount,
  totalBaskets,
  avgBasketReturn,
  basketVolatility,
  avgDrawdown,
}: AggregateMetricsProps) {
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

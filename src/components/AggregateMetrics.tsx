import { TrendingUp, Target, Activity, Layers, TrendingDown, BarChart3 } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface AggregateMetricsProps {
  beatRatio: number;
  avgBasketReturn: number;
  basketVolatility: number;
  numberOfBaskets: number;
  avgDrawdown: number;
  winRatio: number;
}

export function AggregateMetrics({
  beatRatio,
  avgBasketReturn,
  basketVolatility,
  numberOfBaskets,
  avgDrawdown,
  winRatio,
}: AggregateMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        title="Beat Ratio"
        value={`${(beatRatio * 100).toFixed(1)}%`}
        icon={Target}
        trend={beatRatio > 0.5 ? "up" : "down"}
        subtitle="vs Benchmark"
      />
      <MetricCard
        title="Win Ratio"
        value={`${(winRatio * 100).toFixed(1)}%`}
        icon={TrendingUp}
        trend={winRatio > 0.5 ? "up" : "neutral"}
        subtitle="Positive Returns"
      />
      <MetricCard
        title="Average Basket Return"
        value={`${(avgBasketReturn * 100).toFixed(2)}%`}
        icon={BarChart3}
        trend={avgBasketReturn > 0 ? "up" : "down"}
      />
      <MetricCard
        title="Basket Volatility"
        value={`${(basketVolatility * 100).toFixed(2)}%`}
        icon={Activity}
        trend="neutral"
        subtitle="Risk Measure"
      />
      <MetricCard
        title="Number of Baskets"
        value={numberOfBaskets}
        icon={Layers}
        trend="neutral"
        subtitle="Rebalancing Periods"
      />
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

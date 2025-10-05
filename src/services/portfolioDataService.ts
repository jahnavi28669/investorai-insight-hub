import * as XLSX from 'xlsx';

export interface AggregateMetrics {
  beatRatio: number;
  avgBasketReturn: number;
  basketVolatility: number;
  numberOfBaskets: number;
  avgDrawdown: number;
  winRatio: number;
}

export interface BasketData {
  date: string;
  basketReturn: number;
  indexReturn: number;
}

export interface TickerData {
  date: string;
  isin: string;
  ticker: string;
  return: number;
  sector: string;
  gicsSector: string;
}

export async function loadPortfolioData(filePath: string) {
  try {
    console.log('Fetching file from:', filePath);
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    console.log('ArrayBuffer size:', arrayBuffer.byteLength);
    
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    console.log('Workbook sheets:', workbook.SheetNames);

    // Extract Aggregate data (first sheet)
    const aggregateSheet = workbook.Sheets[workbook.SheetNames[0]];
    const aggregateData = XLSX.utils.sheet_to_json(aggregateSheet);
    console.log('Aggregate data rows:', aggregateData.length);
    console.log('First aggregate row:', aggregateData[0]);

    // Extract Basket data (second sheet)
    const basketSheet = workbook.Sheets[workbook.SheetNames[1]];
    const basketData = XLSX.utils.sheet_to_json(basketSheet);
    console.log('Basket data rows:', basketData.length);
    console.log('First basket row:', basketData[0]);

    // Extract Ticker data (third sheet, if it exists)
    const tickerSheet = workbook.Sheets[workbook.SheetNames[2]];
    const tickerData = tickerSheet ? XLSX.utils.sheet_to_json(tickerSheet) : [];
    console.log('Ticker data rows:', tickerData.length);

    const processedBasketData = processBasketData(basketData);

    return {
      aggregate: processAggregateData(aggregateData, processedBasketData.length),
      basket: processedBasketData,
      ticker: processTickerData(tickerData),
    };
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    return null;
  }
}

function processAggregateData(data: any[], actualBasketCount: number): AggregateMetrics {
  if (!data || data.length === 0) {
    return {
      beatRatio: 0,
      avgBasketReturn: 0,
      basketVolatility: 0,
      numberOfBaskets: actualBasketCount,
      avgDrawdown: 0,
      winRatio: 0,
    };
  }

  // Calculate means across all chains
  const beatRatios = data.map((row) => Number(row.basket_beat_ratio) || 0);
  const avgReturns = data.map((row) => Number(row.avg_basket_returns) || 0);
  const volatilities = data.map((row) => Number(row.std_basket_returns) || 0);
  const drawdowns = data.map((row) => parseDrawdown(row.avg_drawdown) || 0);
  const winRatios = data.map((row) => Number(row.basket_win_ratio) || 0);

  return {
    beatRatio: calculateMean(beatRatios),
    avgBasketReturn: calculateMean(avgReturns),
    basketVolatility: calculateMean(volatilities),
    numberOfBaskets: actualBasketCount,
      avgDrawdown: calculateMean(drawdowns),
    winRatio: calculateMean(winRatios),
  };
}

/**
 * Parse various drawdown formats into a decimal number (e.g. -0.1234 for -12.34%).
 * Accepts numbers, percent strings like "12.34%" or "-12.34%", and parentheses like "(12.34%)".
 */
function parseDrawdown(value: any): number {
  if (value === null || value === undefined || value === '') return 0;

  // If already a number, assume it's decimal (e.g., -0.12) or whole percent (e.g., 12) depending on magnitude
  if (typeof value === 'number') {
    // If number looks like a percent (absolute value > 1), convert to decimal
    if (Math.abs(value) > 1) return value / 100;
    return value;
  }

  let s = String(value).trim();

  // Handle parentheses for negative values: (12.34%) or (12.34)
  const parenMatch = s.match(/^\((.*)\)$/);
  if (parenMatch) s = `-${parenMatch[1].trim()}`;

  // Remove percent sign and whitespace
  const hasPercent = s.includes('%');
  s = s.replace('%', '').replace(/,/g, '').trim();

  const n = Number(s);
  if (isNaN(n)) return 0;

  return hasPercent || Math.abs(n) > 1 ? n / 100 : n;
}

function processBasketData(data: any[]): BasketData[] {
  if (!data || data.length === 0) return [];

  return data.map((row) => ({
    date: formatDate(row.Date),
    basketReturn: Number(row.basket_returns) * 100 || 0,
    indexReturn: Number(row.index_returns) * 100 || 0,
  }));
}

function processTickerData(data: any[]): TickerData[] {
  if (!data || data.length === 0) return [];

  return data.map((row) => ({
    date: formatDate(row.Date),
    isin: String(row.ISIN || ''),
    ticker: String(row.Ticker || ''),
    return: Number(row.tickers_return) * 100 || 0,
    sector: String(row.GICS_SECTOR || ''),
    gicsSector: String(row['GICS SECTOR'] || row.GICS_SECTOR || ''),
  }));
}

function calculateMean(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
}

function formatDate(dateValue: any): string {
  if (!dateValue) return '';
  
  // Handle Excel date serial numbers
  if (typeof dateValue === 'number') {
    const date = XLSX.SSF.parse_date_code(dateValue);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  
  // Handle string dates
  if (typeof dateValue === 'string') {
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }
  
  return String(dateValue);
}

export function getTopPerformers(tickerData: TickerData[], limit: number = 10): { ticker: string; return: number }[] {
  // Group by ticker and calculate cumulative return
  const tickerMap = new Map<string, number[]>();
  
  tickerData.forEach((ticker) => {
    const returns = tickerMap.get(ticker.ticker) || [];
    returns.push(ticker.return / 100); // Convert to decimal
    tickerMap.set(ticker.ticker, returns);
  });

  // Calculate cumulative return for each ticker
  const tickerReturns = Array.from(tickerMap.entries()).map(([ticker, returns]) => {
    const cumulativeReturn = returns.reduce((acc, ret) => acc * (1 + ret), 1) - 1;
    return { ticker, return: cumulativeReturn * 100 }; // Convert back to percentage
  });

  // Get only required number of unique tickers
  const sorted = tickerReturns.sort((a, b) => b.return - a.return);
  return sorted.slice(0, Math.min(limit, sorted.length));
}

export function getWorstPerformers(tickerData: TickerData[], limit: number = 10): { ticker: string; return: number }[] {
  // Group by ticker and calculate cumulative return
  const tickerMap = new Map<string, number[]>();
  
  tickerData.forEach((ticker) => {
    const returns = tickerMap.get(ticker.ticker) || [];
    returns.push(ticker.return / 100); // Convert to decimal
    tickerMap.set(ticker.ticker, returns);
  });

  // Calculate cumulative return for each ticker
  const tickerReturns = Array.from(tickerMap.entries()).map(([ticker, returns]) => {
    const cumulativeReturn = returns.reduce((acc, ret) => acc * (1 + ret), 1) - 1;
    return { ticker, return: cumulativeReturn * 100 }; // Convert back to percentage
  });

  // Get only required number of unique tickers
  const sorted = tickerReturns.sort((a, b) => a.return - b.return);
  return sorted.slice(0, Math.min(limit, sorted.length));
}

export function getSectorAnalysis(tickerData: TickerData[]): { sector: string; avgReturn: number; count: number }[] {
  const sectorMap = new Map<string, { sum: number; count: number }>();

  tickerData.forEach((ticker) => {
    const sector = ticker.gicsSector || ticker.sector || 'Unknown';
    const existing = sectorMap.get(sector) || { sum: 0, count: 0 };
    sectorMap.set(sector, {
      sum: existing.sum + ticker.return,
      count: existing.count + 1,
    });
  });

  return Array.from(sectorMap.entries())
    .map(([sector, data]) => ({
      sector,
      avgReturn: data.sum / data.count,
      count: data.count,
    }))
    .sort((a, b) => b.avgReturn - a.avgReturn);
}

export function getTickerStats(tickerData: TickerData[]): { ticker: string; mean: number; stdDev: number; count: number }[] {
  const tickerMap = new Map<string, number[]>();
  
  tickerData.forEach((ticker) => {
    const returns = tickerMap.get(ticker.ticker) || [];
    returns.push(ticker.return);
    tickerMap.set(ticker.ticker, returns);
  });

  return Array.from(tickerMap.entries())
    .map(([ticker, returns]) => {
      const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
      const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
      const stdDev = Math.sqrt(variance);
      
      return {
        ticker,
        mean,
        stdDev,
        count: returns.length,
      };
    })
    .sort((a, b) => b.mean - a.mean);
}

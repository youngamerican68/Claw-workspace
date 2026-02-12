import { MCPComponent, MetricsChartProps, TimeSeriesData } from '../../types';

/**
 * MetricsChart
 * 
 * A flexible chart component for visualizing time-series metrics.
 * Supports line, bar, and area charts with customizable styling.
 * 
 * @example
 * ```typescript
 * const chart = MetricsChart({
 *   data: [
 *     { timestamp: '2026-02-01T00:00:00Z', value: 150 },
 *     { timestamp: '2026-02-01T01:00:00Z', value: 230 },
 *   ],
 *   chartType: 'line',
 *   xAxisLabel: 'Time',
 *   yAxisLabel: 'Tasks Completed'
 * });
 * ```
 */
export function MetricsChart(props: MetricsChartProps): MCPComponent {
  const {
    data,
    chartType,
    xAxisLabel,
    yAxisLabel,
    color = '#667eea',
    height = 250
  } = props;

  // Validate data
  if (!data || data.length === 0) {
    throw new Error('MetricsChart requires data array with at least one data point');
  }

  // Calculate statistics for display
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  return {
    type: 'interactive',
    component: 'MetricsChart',
    version: '0.1.0',
    props: {
      chartType,
      height,
      color,
      xAxis: {
        label: xAxisLabel,
        type: 'time',
        data: data.map(d => d.timestamp)
      },
      yAxis: {
        label: yAxisLabel,
        min,
        max,
        format: 'number'
      },
      series: [
        {
          name: yAxisLabel || 'Value',
          data: data.map(d => d.value),
          color
        }
      ],
      // Summary statistics displayed alongside chart
      statistics: {
        min: Math.round(min),
        max: Math.round(max),
        average: Math.round(avg),
        total: Math.round(values.reduce((a, b) => a + b, 0))
      },
      // Interactive features
      interactions: {
        tooltip: true,
        zoom: true,
        pan: true,
        download: true
      }
    }
  };
}

// Helper to generate sample time-series data
export function generateTimeSeriesData(
  points: number = 24,
  interval: 'hour' | 'day' = 'hour',
  baseValue: number = 100,
  variance: number = 0.3
): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now);
    if (interval === 'hour') {
      timestamp.setHours(timestamp.getHours() - i);
    } else {
      timestamp.setDate(timestamp.getDate() - i);
    }
    
    // Generate realistic-looking data with some randomness
    const randomVariation = (Math.random() - 0.5) * 2 * variance;
    const trend = Math.sin(i / 5) * 0.2; // Slight cyclical pattern
    const value = Math.max(0, Math.round(baseValue * (1 + randomVariation + trend)));
    
    data.push({
      timestamp: timestamp.toISOString(),
      value,
      label: interval === 'hour' 
        ? timestamp.getHours() + ':00'
        : timestamp.toLocaleDateString()
    });
  }
  
  return data;
}

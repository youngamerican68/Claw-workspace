import { MCPComponent, AgentMetricsDashboardProps, AgentMetric } from '../../types';

/**
 * AgentMetricsDashboard
 * 
 * A real-time dashboard showing performance metrics for AI agents.
 * Displays tasks completed, token usage, error rates, and latency.
 * 
 * @example
 * ```typescript
 * const dashboard = AgentMetricsDashboard({
 *   agents: ['researcher', 'writer', 'reviewer'],
 *   timeRange: '24h',
 *   metrics: ['tasks_completed', 'tokens_used', 'errors'],
 *   showComparison: true
 * });
 * ```
 */
export function AgentMetricsDashboard(props: AgentMetricsDashboardProps): MCPComponent {
  const {
    agents,
    timeRange,
    metrics,
    showComparison = false,
    title = 'Agent Performance Dashboard',
    refreshInterval = 30,
    theme = 'auto'
  } = props;

  // In a real implementation, this would fetch data from an API
  // For now, we return the component schema
  return {
    type: 'interactive',
    component: 'AgentMetricsDashboard',
    version: '0.1.0',
    props: {
      title,
      agents,
      timeRange,
      metrics,
      showComparison,
      refreshInterval,
      theme,
      // Schema defines what the UI should render
      layout: {
        type: 'grid',
        columns: showComparison ? 2 : 1,
        items: [
          {
            type: 'metric_card',
            metric: 'tasks_completed',
            label: 'Tasks Completed',
            format: 'number',
            trend: true
          },
          {
            type: 'metric_card',
            metric: 'tokens_used',
            label: 'Tokens Used',
            format: 'tokens',
            trend: true
          },
          {
            type: 'metric_card',
            metric: 'errors',
            label: 'Error Rate',
            format: 'percentage',
            trend: true,
            color: 'red'
          },
          {
            type: 'metric_card',
            metric: 'latency',
            label: 'Avg Latency',
            format: 'duration',
            trend: true
          },
          {
            type: 'chart',
            chartType: 'line',
            metric: 'tasks_completed',
            timeRange,
            height: 300
          }
        ]
      },
      // Data source configuration
      dataSource: {
        type: 'api',
        endpoint: '/api/agents/metrics',
        params: {
          agentIds: agents,
          timeRange,
          metrics
        },
        refreshInterval: refreshInterval * 1000
      }
    }
  };
}

// Helper function to generate mock data for testing
export function generateMockAgentMetrics(agentIds: string[]): AgentMetric[] {
  return agentIds.map(id => ({
    agentId: id,
    agentName: id.charAt(0).toUpperCase() + id.slice(1),
    tasksCompleted: Math.floor(Math.random() * 100),
    tasksFailed: Math.floor(Math.random() * 10),
    tokensUsed: Math.floor(Math.random() * 50000),
    averageLatency: Math.floor(Math.random() * 5000) + 500,
    status: Math.random() > 0.8 ? 'error' : Math.random() > 0.5 ? 'active' : 'idle',
    lastActivity: new Date().toISOString()
  }));
}

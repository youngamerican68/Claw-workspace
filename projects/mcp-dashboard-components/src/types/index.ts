// MCP Dashboard Component Types
// Defines the interface for all interactive MCP App components

export interface MCPComponent {
  type: 'interactive';
  component: string;
  props: Record<string, any>;
  version: string;
}

export interface AgentMetric {
  agentId: string;
  agentName: string;
  tasksCompleted: number;
  tasksFailed: number;
  tokensUsed: number;
  averageLatency: number; // milliseconds
  status: 'active' | 'idle' | 'error';
  lastActivity: string; // ISO timestamp
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface DashboardProps {
  title?: string;
  refreshInterval?: number; // seconds
  theme?: 'light' | 'dark' | 'auto';
}

export interface AgentMetricsDashboardProps extends DashboardProps {
  agents: string[]; // Agent IDs to display
  timeRange: '1h' | '24h' | '7d' | '30d';
  metrics: ('tasks_completed' | 'tokens_used' | 'errors' | 'latency')[];
  showComparison?: boolean;
}

export interface MetricsChartProps {
  data: TimeSeriesData[];
  chartType: 'line' | 'bar' | 'area';
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  height?: number;
}

export interface ApprovalWorkflowProps {
  workflowId: string;
  title: string;
  description: string;
  actions: {
    approve: { label: string; callback: string };
    reject: { label: string; callback: string };
    requestChanges?: { label: string; callback: string };
  };
  metadata?: Record<string, any>;
  timeout?: number; // seconds until auto-reject
}

export interface AgentActivityFeedProps {
  agentId?: string; // If undefined, shows all agents
  maxItems?: number;
  filter?: ('task_start' | 'task_complete' | 'error' | 'api_call')[];
  realtime?: boolean;
}

// Component registry
export type ComponentType = 
  | 'AgentMetricsDashboard'
  | 'MetricsChart'
  | 'ComparisonTable'
  | 'LogViewer'
  | 'ApprovalWorkflow'
  | 'MultiStepForm'
  | 'AgentActivityFeed'
  | 'AlertPanel'
  | 'StatusTracker';

export interface ComponentRegistry {
  [key: string]: (props: any) => MCPComponent;
}

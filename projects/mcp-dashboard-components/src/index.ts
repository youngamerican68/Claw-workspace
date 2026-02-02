// MCP Dashboard Components
// Pre-built interactive components for MCP Apps

// Dashboards
export { AgentMetricsDashboard, generateMockAgentMetrics } from './components/dashboards/AgentMetricsDashboard';

// Visualizers
export { MetricsChart, generateTimeSeriesData } from './components/visualizers/MetricsChart';

// Types
export * from './types';

// Version
export const VERSION = '0.1.0';

// Component registry for dynamic component loading
import { ComponentRegistry } from './types';
import { AgentMetricsDashboard } from './components/dashboards/AgentMetricsDashboard';
import { MetricsChart } from './components/visualizers/MetricsChart';

export const componentRegistry: ComponentRegistry = {
  AgentMetricsDashboard,
  MetricsChart,
  // More components will be added here
};

// Helper function to render any registered component
export function renderComponent(
  componentName: string,
  props: any
) {
  const component = componentRegistry[componentName];
  if (!component) {
    throw new Error(`Component "${componentName}" not found in registry`);
  }
  return component(props);
}

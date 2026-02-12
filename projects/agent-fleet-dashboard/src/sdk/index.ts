/**
 * Agent Fleet SDK
 * 
 * Drop this into your AI agents to connect them to the Fleet Dashboard.
 * Works with OpenClaw, Claude Code, Cursor, or any custom agent.
 * 
 * @example
 * ```typescript
 * import { AgentFleet } from '@agent-fleet/sdk';
 * 
 * const agent = new AgentFleet({
 *   agentId: 'researcher-1',
 *   agentName: 'Research Assistant',
 *   apiKey: process.env.FLEET_API_KEY
 * });
 * 
 * // Start session
 * await agent.startSession();
 * 
 * // Log activity
 * agent.logAction({
 *   type: 'api_call',
 *   provider: 'openai',
 *   model: 'gpt-4',
 *   tokensUsed: 1500,
 *   cost: 0.045
 * });
 * 
 * // End session
 * await agent.endSession();
 * ```
 */

export interface AgentConfig {
  agentId: string;
  agentName: string;
  apiKey: string;
  endpoint?: string;
  environment?: 'development' | 'staging' | 'production';
  metadata?: Record<string, any>;
}

export interface AgentAction {
  type: 'api_call' | 'file_read' | 'file_write' | 'command_exec' | 'error' | 'task_start' | 'task_complete';
  timestamp?: string;
  duration?: number; // milliseconds
  metadata?: Record<string, any>;
}

export interface APICallAction extends AgentAction {
  type: 'api_call';
  provider: 'openai' | 'anthropic' | 'google' | 'other';
  model: string;
  tokensUsed: number;
  tokensPrompt?: number;
  tokensCompletion?: number;
  cost: number;
  latency: number; // milliseconds
}

export interface FileAction extends AgentAction {
  type: 'file_read' | 'file_write';
  filePath: string;
  fileSize?: number;
  contentHash?: string;
}

export interface CommandAction extends AgentAction {
  type: 'command_exec';
  command: string;
  workingDirectory: string;
  exitCode: number;
  stdout?: string;
  stderr?: string;
}

export class AgentFleet {
  private config: AgentConfig;
  private sessionId: string | null = null;
  private ws: WebSocket | null = null;
  private actionQueue: AgentAction[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(config: AgentConfig) {
    this.config = {
      endpoint: 'https://api.agentfleet.dev',
      environment: 'development',
      ...config
    };
  }

  /**
   * Start a new agent session
   */
  async startSession(): Promise<void> {
    this.sessionId = this.generateSessionId();
    
    // Connect to real-time stream
    await this.connectWebSocket();
    
    // Start flush interval (send batched actions every 5 seconds)
    this.flushInterval = setInterval(() => this.flushActions(), 5000);
    
    // Report session start
    this.send({
      type: 'session_start',
      sessionId: this.sessionId,
      agentId: this.config.agentId,
      agentName: this.config.agentName,
      environment: this.config.environment,
      metadata: this.config.metadata,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log an agent action
   */
  logAction(action: AgentAction): void {
    const enrichedAction = {
      ...action,
      timestamp: action.timestamp || new Date().toISOString(),
      sessionId: this.sessionId,
      agentId: this.config.agentId
    };
    
    this.actionQueue.push(enrichedAction);
    
    // Immediate flush for critical actions
    if (action.type === 'error') {
      this.flushActions();
    }
  }

  /**
   * Log API call (OpenAI, Anthropic, etc.)
   */
  logAPICall(call: Omit<APICallAction, 'type'>): void {
    this.logAction({
      type: 'api_call',
      ...call
    });
  }

  /**
   * Log file operation
   */
  logFileOperation(operation: Omit<FileAction, 'type'>): void {
    this.logAction({
      type: operation.type,
      ...operation
    } as FileAction);
  }

  /**
   * Log command execution
   */
  logCommand(command: Omit<CommandAction, 'type'>): void {
    this.logAction({
      type: 'command_exec',
      ...command
    } as CommandAction);
  }

  /**
   * End the current session
   */
  async endSession(): Promise<void> {
    // Flush remaining actions
    await this.flushActions();
    
    // Send session end
    this.send({
      type: 'session_end',
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    });
    
    // Cleanup
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    if (this.ws) {
      this.ws.close();
    }
    
    this.sessionId = null;
  }

  /**
   * Get current session metrics
   */
  async getSessionMetrics(): Promise<{
    duration: number;
    totalCost: number;
    totalTokens: number;
    actionsCount: number;
  }> {
    // In real implementation, this would fetch from API
    return {
      duration: 0,
      totalCost: 0,
      totalTokens: 0,
      actionsCount: this.actionQueue.length
    };
  }

  private async connectWebSocket(): Promise<void> {
    const wsUrl = this.config.endpoint!.replace('https://', 'wss://').replace('http://', 'ws://');
    this.ws = new WebSocket(`${wsUrl}/stream?apiKey=${this.config.apiKey}`);
    
    return new Promise((resolve, reject) => {
      this.ws!.onopen = () => resolve();
      this.ws!.onerror = (err) => reject(err);
    });
  }

  private async flushActions(): Promise<void> {
    if (this.actionQueue.length === 0) return;
    
    const actions = [...this.actionQueue];
    this.actionQueue = [];
    
    this.send({
      type: 'actions_batch',
      sessionId: this.sessionId,
      actions,
      timestamp: new Date().toISOString()
    });
  }

  private send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Auto-instrumentation helpers
export function instrumentOpenAI(agent: AgentFleet, openai: any) {
  // Wrap OpenAI client to auto-log API calls
  const originalCreate = openai.chat.completions.create;
  openai.chat.completions.create = async function(...args: any[]) {
    const startTime = Date.now();
    const result = await originalCreate.apply(this, args);
    const latency = Date.now() - startTime;
    
    agent.logAPICall({
      provider: 'openai',
      model: result.model,
      tokensUsed: result.usage?.total_tokens || 0,
      tokensPrompt: result.usage?.prompt_tokens,
      tokensCompletion: result.usage?.completion_tokens,
      cost: calculateOpenAICost(result.model, result.usage?.total_tokens || 0),
      latency,
      timestamp: new Date().toISOString()
    });
    
    return result;
  };
}

function calculateOpenAICost(model: string, tokens: number): number {
  // Simplified pricing - real implementation would use actual pricing tiers
  const pricing: Record<string, number> = {
    'gpt-4': 0.03,
    'gpt-4-turbo': 0.01,
    'gpt-3.5-turbo': 0.0015
  };
  return (tokens / 1000) * (pricing[model] || 0.01);
}

/**
 * Moltbook Orchestrator
 * Main entry point for multi-agent workflow management
 */

const MoltbookNotionClient = require('./notion-client');
const fs = require('fs');
const path = require('path');

class MoltbookOrchestrator {
  constructor(configPath) {
    this.config = this.loadConfig(configPath);
    this.notionClient = new MoltbookNotionClient(
      process.env.NOTION_TOKEN,
      process.env.MOLTBOOK_DB_ID
    );
    this.agents = new Map();
  }

  loadConfig(configPath) {
    const yaml = require('js-yaml');
    const content = fs.readFileSync(configPath, 'utf8');
    return yaml.load(content);
  }

  /**
   * Register an agent with the orchestrator
   */
  registerAgent(agentConfig) {
    this.agents.set(agentConfig.name, {
      ...agentConfig,
      status: 'idle',
      currentTask: null
    });
    console.log(`Agent registered: ${agentConfig.name}`);
  }

  /**
   * Start the orchestrator - check for pending handoffs and dispatch
   */
  async start() {
    console.log('🪶 Moltbook Orchestrator starting...');
    console.log(`Workflow: ${this.config.workflow.name}`);
    console.log(`Agents: ${Object.keys(this.config.agents).join(', ')}\n`);

    // Register all agents from config
    Object.values(this.config.agents).forEach(agent => {
      this.registerAgent(agent);
    });

    // Main loop - check for pending handoffs
    setInterval(async () => {
      await this.processPendingHandoffs();
    }, 30000); // Check every 30 seconds

    // Initial check
    await this.processPendingHandoffs();
  }

  /**
   * Process pending handoffs for all agents
   */
  async processPendingHandoffs() {
    for (const [agentName, agent] of this.agents) {
      if (agent.status === 'busy') continue;

      try {
        const handoffs = await this.notionClient.readPendingHandoffs(agentName);
        
        if (handoffs.length > 0) {
          console.log(`[${new Date().toISOString()}] ${agentName}: ${handoffs.length} pending handoff(s)`);
          
          // Process the most recent handoff
          const handoff = handoffs[0];
          await this.executeHandoff(agent, handoff);
        }
      } catch (err) {
        console.error(`Error processing handoffs for ${agentName}:`, err.message);
      }
    }
  }

  /**
   * Execute a handoff - trigger the agent to perform its task
   */
  async executeHandoff(agent, handoff) {
    console.log(`\n[EXECUTING] ${agent.name} processing task ${handoff.taskId}`);
    
    // Update agent status
    agent.status = 'busy';
    agent.currentTask = handoff.taskId;

    // Update handoff status to in_progress
    await this.notionClient.updateStatus(
      handoff.id, 
      'in_progress', 
      `${agent.name} started processing at ${new Date().toISOString()}`
    );

    // Trigger the agent's action (in real implementation, this would call OpenClaw)
    console.log(`  Action: ${handoff.nextAction}`);
    console.log(`  Context: ${JSON.stringify(handoff.context, null, 2)}`);

    // Simulate work (in real implementation, agent does actual work here)
    await this.simulateAgentWork(agent, handoff);

    // Mark as completed
    await this.notionClient.updateStatus(
      handoff.id,
      'completed',
      `${agent.name} completed task at ${new Date().toISOString()}`
    );

    // Create next handoff if configured
    if (agent.handoff_to && agent.handoff_to !== 'human') {
      await this.createNextHandoff(agent, handoff);
    } else {
      console.log(`  ✓ Task complete - handing to human`);
    }

    // Reset agent status
    agent.status = 'idle';
    agent.currentTask = null;
  }

  /**
   * Create handoff to next agent in workflow
   */
  async createNextHandoff(currentAgent, completedHandoff) {
    const nextAgentName = currentAgent.handoff_to;
    const nextAgent = this.agents.get(nextAgentName);

    if (!nextAgent) {
      console.error(`Next agent not found: ${nextAgentName}`);
      return;
    }

    console.log(`  → Creating handoff to ${nextAgentName}`);

    await this.notionClient.writeHandoff({
      fromAgent: currentAgent.name,
      toAgent: nextAgentName,
      taskId: completedHandoff.taskId,
      summary: `Completed by ${currentAgent.name}`,
      context: {
        previousAgent: currentAgent.name,
        previousSummary: completedHandoff.summary,
        output: "Agent output would go here"
      },
      nextAction: nextAgent.role,
      priority: completedHandoff.priority,
      requiresApproval: nextAgent.handoff_to === 'human'
    });
  }

  /**
   * Simulate agent work (placeholder for actual OpenClaw integration)
   */
  async simulateAgentWork(agent, handoff) {
    // In real implementation, this would:
    // 1. Call OpenClaw with the agent's configuration
    // 2. Pass the context from the handoff
    // 3. Wait for completion
    // 4. Capture output

    const workTime = Math.random() * 5000 + 2000; // 2-7 seconds
    await new Promise(resolve => setTimeout(resolve, workTime));
    
    console.log(`  ✓ ${agent.name} completed work (${Math.round(workTime/1000)}s)`);
  }
}

module.exports = MoltbookOrchestrator;

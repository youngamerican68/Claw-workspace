# Moltbook Skill

Read and write to the multi-agent moltbook (shared Notion workspace).

## Purpose

Enable OpenClaw agents to communicate asynchronously via a structured logbook in Notion. Agents can hand off tasks, share context, and coordinate without human intervention.

## When to Use

- When agent needs to log task completion
- When agent needs to read context from previous agent
- When agent needs to trigger next agent in workflow
- When human oversight/approval is required before handoff

## How It Works

The moltbook is a Notion database with structured entries. Each entry represents a handoff between agents.

### Entry Structure

```json
{
  "timestamp": "2026-02-14T01:15:00Z",
  "from_agent": "ResearchAgent",
  "to_agent": "WriterAgent",
  "task_id": "blog-post-001",
  "status": "handoff",
  "summary": "Found 10 sources on AI trends",
  "context": {
    "sources": [...],
    "key_findings": "...",
    "suggested_angle": "..."
  },
  "next_action": "Write 500-word draft",
  "priority": "high",
  "estimated_time": "30min"
}
```

## Configuration

```yaml
notion_token: ${NOTION_TOKEN}
moltbook_database_id: ${MOLTBOOK_DB_ID}
telegram_chat_id: ${TELEGRAM_CHAT_ID}  # For notifications
```

## Functions

### write_handoff

Write a handoff entry to the moltbook.

**Arguments:**
- `from_agent` (string): Name of agent completing task
- `to_agent` (string): Name of agent to receive handoff
- `task_id` (string): Unique task identifier
- `summary` (string): Brief description of completed work
- `context` (object): Structured context for next agent
- `next_action` (string): What the next agent should do
- `priority` (string): low | medium | high

**Returns:** Entry ID in Notion

### read_handoff

Read the latest handoff for a specific agent.

**Arguments:**
- `agent_name` (string): Agent to read handoffs for
- `status` (string): pending | in_progress | completed

**Returns:** Handoff entry object

### update_status

Update the status of a handoff entry.

**Arguments:**
- `entry_id` (string): Notion page ID
- `status` (string): pending | in_progress | completed | blocked
- `notes` (string): Optional status notes

## Examples

### Research Agent Completes Task

```
ResearchAgent found 10 sources on AI trends.
Writing handoff to WriterAgent to create blog post draft.
```

### Writer Agent Picks Up Task

```
Reading moltbook for pending handoffs to WriterAgent.
Found task blog-post-001 from ResearchAgent.
Context: 10 sources on AI trends, suggested angle on enterprise adoption.
```

### Human Override

```
ResearchAgent completed task but flagged for human review.
Sending Telegram notification to @pjstockbees for approval.
```

## Scripts

- `write_handoff.js`: Write handoff entry to Notion
- `read_handoff.js`: Read pending handoffs for agent
- `update_status.js`: Update handoff status
- `notify_human.js`: Send Telegram notification for human review

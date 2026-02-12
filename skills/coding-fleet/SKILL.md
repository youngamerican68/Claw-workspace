# Coding Agent Fleet

> Build your own Codex-style multi-agent coding system with OpenClaw.

## Overview

The Coding Agent Fleet brings multi-agent collaboration to your codebase. Inspired by OpenAI's unreleased Codex features (reverse-engineered by Deedy), this template lets you run specialized AI agents that write, review, test, and document code.

**Key Features:**
- 🧑‍💻 **Coder Agent**: Writes code from specifications
- 🔍 **Reviewer Agent**: Reviews for bugs, security, and style
- 🧪 **Test Agent**: Generates and runs tests
- 📝 **Docs Agent**: Auto-generates documentation
- 👻 **Ghost Commits**: Experiment on feature branches with auto-rollback
- 🔄 **CI/CD Integration**: GitHub Actions workflow included

## Quick Start

### 1. Install the Skill

```bash
cp -r skills/coding-fleet ~/.openclaw/skills/
```

### 2. Configure Your Repository

Add to your repo's `.openclaw/config.yaml`:

```yaml
skills:
  - coding-fleet

coding_fleet:
  # Agent personalities (optional)
  coder:
    model: synthetic/hf:qwen/Qwen2.5-Coder-32B-Instruct
    temperature: 0.2
  reviewer:
    model: synthetic/hf:moonshotai/Kimi-K2.5
    temperature: 0.1
  
  # Workflow settings
  auto_merge: false
  ghost_branch_prefix: "ghost/"
  max_rollback_commits: 5
```

### 3. Run Locally

```bash
# Start a coding session
openclaw run coding-fleet --spec "Build a React login form with validation"

# Or run specific agents
openclaw run coding-fleet/coder --spec "Create a Python API client"
openclaw run coding-fleet/reviewer --target src/api/client.py
```

### 4. GitHub Actions Setup

Copy the workflow to your repo:

```bash
cp skills/coding-fleet/.github/workflows/coding-fleet.yml .github/workflows/
```

Add repository secrets:
- `OPENCLAW_TOKEN`: Your OpenClaw API token
- `OPENCLAW_HOST`: Your OpenClaw gateway URL

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Coding Agent Fleet                    │
├─────────────────────────────────────────────────────────┤
│  Trigger (PR / Push / Manual)                           │
│     ↓                                                   │
│  ┌─────────┐   ┌──────────┐   ┌────────┐   ┌────────┐  │
│  │  Coder  │ → │ Reviewer │ → │ Tester │ → │  Docs  │  │
│  │  Agent  │   │  Agent   │   │ Agent  │   │ Agent  │  │
│  └─────────┘   └──────────┘   └────────┘   └────────┘  │
│       ↓              ↓            ↓            ↓        │
│   Write Code    Review      Run Tests    Update Docs    │
│       ↓              ↓            ↓            ↓        │
│   Ghost Commit  Approve/Reject  Pass/Fail  PR Comment   │
│     (opt)                                                          │
└─────────────────────────────────────────────────────────┘
```

## Customizing Agents

### Agent Configuration

Each agent can be customized via YAML:

```yaml
# .openclaw/coding-fleet.yaml
coder:
  name: "Senior TypeScript Developer"
  personality: |
    You are a meticulous TypeScript developer who:
    - Prefers functional programming patterns
    - Always adds comprehensive JSDoc comments
    - Follows strict typing (no `any`)
  tools:
    - read
    - write
    - edit
    - exec
  prompt_template: |
    Write code for: {{spec}}
    
    Context:
    {{context}}
    
    Requirements:
    {{requirements}}
```

### Creating Custom Agents

1. Create a new agent file:

```bash
touch skills/coding-fleet/agents/security-agent.yaml
```

2. Define the agent:

```yaml
name: security-agent
description: Security-focused code auditor
model: synthetic/hf:moonshotai/Kimi-K2.5
system_prompt: |
  You are a security engineer. Review code for:
  - SQL injection vulnerabilities
  - XSS vulnerabilities  
  - Insecure secrets handling
  - Path traversal issues
  
  Output: JSON with findings array

tools:
  - read
  - web_search
```

3. Add to the fleet workflow:

```yaml
# In fleet.yaml
agents:
  - coder
  - reviewer
  - security-agent  # Add here
  - tester
```

## Example Workflows

### Build a React Component

```bash
# 1. Create spec
openclaw run coding-fleet --spec @specs/login-form.md

# 2. Agents run sequentially
# Coder writes → Reviewer checks → Tester validates → Docs updates

# 3. Review the ghost commit
gh pr create --title "[Ghost] Login Form Component"
```

**Spec Format (`specs/login-form.md`):**

```markdown
# Login Form Component

## Requirements
- Email validation with regex
- Password strength indicator
- Submit button disabled until valid
- Error message display

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- React Hook Form

## API
```typescript
interface LoginFormProps {
  onSubmit: (data: LoginData) => Promise<void>;
  loading?: boolean;
}
```

## Acceptance Criteria
- [ ] Renders email input
- [ ] Renders password input  
- [ ] Shows validation errors
- [ ] Calls onSubmit with form data
```

### API Endpoint Development

```yaml
# .github/workflows/feature-api.yml
name: Build API Endpoint
on:
  issues:
    types: [labeled]
    
jobs:
  build-endpoint:
    if: contains(github.event.label.name, 'api-request')
    uses: ./.github/workflows/coding-fleet.yml
    with:
      spec: ${{ github.event.issue.body }}
      agents: "coder,reviewer,tester"
      ghost_branch: "ghost/api-${{ github.event.issue.number }}"
```

## Dashboard

Open `skills/coding-fleet/dashboard.html` in a browser to view:

- Real-time agent status
- Timeline of actions
- Commit/PR links
- Success/failure indicators

Or serve it:

```bash
cd skills/coding-fleet
python -m http.server 8080
# Open http://localhost:8080/dashboard.html
```

## Ghost Commits & Rollback

Ghost commits let agents experiment safely:

```bash
# Agent creates feature branch
git checkout -b ghost/feature-xyz

# Makes commits
git commit -m "[ghost] coder: implement auth flow"
git commit -m "[ghost] reviewer: fix null check"

# If tests fail → auto-rollback
gh pr close --comment "Tests failed, rolling back"

# If approved → promote to real PR
git checkout main
git merge ghost/feature-xyz
```

Configure rollback behavior:

```yaml
coding_fleet:
  ghost_commits:
    enabled: true
    auto_rollback_on_failure: true
    preserve_branches: false  # Delete after merge/close
```

## Agent Reference

### Coder Agent

**Purpose**: Write implementation code from specs

**Inputs**:
- `spec`: Feature specification
- `context`: Existing codebase context
- `language`: Target programming language

**Outputs**:
- New/modified source files
- Implementation notes

### Reviewer Agent

**Purpose**: Code review for quality

**Inputs**:
- `target`: File(s) to review
- `review_type`: [security, style, performance, all]

**Outputs**:
- Review comments
- Suggested fixes
- Approval/rejection status

### Tester Agent

**Purpose**: Generate and run tests

**Inputs**:
- `target`: Code to test
- `test_types`: [unit, integration, e2e]

**Outputs**:
- Test files
- Test results
- Coverage report

### Docs Agent

**Purpose**: Generate documentation

**Inputs**:
- `target`: Code to document
- `doc_type`: [api, readme, inline]

**Outputs**:
- Documentation files
- Updated README
- PR comments with docs

## Troubleshooting

### Agents Hang

Check agent timeout settings:
```yaml
coding_fleet:
  timeouts:
    coder: 300
    reviewer: 180
    tester: 600
```

### Ghost Branches Pile Up

Enable auto-cleanup:
```yaml
coding_fleet:
  ghost_commits:
    auto_cleanup_after_days: 7
```

### Reviewer Too Strict

Adjust personality:
```yaml
reviewer:
  personality: |
    Be
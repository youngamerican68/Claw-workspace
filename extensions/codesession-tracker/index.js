import { execSync } from 'node:child_process';
import fs from 'node:fs';

const LOG = '/tmp/cs-tracker.log';
function log(msg) {
  fs.appendFileSync(LOG, new Date().toISOString() + ' ' + msg + '\n');
}

export function register(ctx) {
  log('codesession-tracker registered');

  let sessionStarted = false;
  function ensureSession() {
    if (sessionStarted) return;
    try {
      execSync('cs start "OpenClaw Gateway Session" --close-stale --json 2>/dev/null', {
        cwd: '/root/.openclaw/workspace',
        timeout: 5000,
      });
      sessionStarted = true;
    } catch { sessionStarted = true; }
  }

  ctx.on('agent_end', async (event, context) => {
    try {
      // Log everything to figure out where provider/model live
      const messages = event.messages || [];
      let lastAssistant = null;
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i]?.role === 'assistant') {
          lastAssistant = messages[i];
          break;
        }
      }
      log('context: ' + JSON.stringify(context || {}));
      log('assistant msg keys: ' + Object.keys(lastAssistant || {}).join(','));
      log('assistant.provider: ' + (lastAssistant?.provider || 'none'));
      log('assistant.model: ' + (lastAssistant?.model || 'none'));
      log('assistant.api: ' + (lastAssistant?.api || 'none'));

      const usage = lastAssistant?.usage;
      if (!usage) return;

      const inputTokens = usage.input_tokens || usage.prompt_tokens || usage.input || 0;
      const outputTokens = usage.output_tokens || usage.completion_tokens || usage.output || 0;
      if (inputTokens === 0 && outputTokens === 0) return;

      // Get provider/model from the assistant message itself
      const provider = lastAssistant?.provider || context?.provider || 'synthetic';
      const model = lastAssistant?.model || context?.modelId || 'unknown';
      const providerCost = usage.cost?.total || 0;

      ensureSession();

      let cmd = 'cs log-ai -p "' + provider + '" -m "' + model + '" --prompt-tokens ' + inputTokens + ' --completion-tokens ' + outputTokens;
      if (providerCost > 0) {
        cmd += ' -c ' + providerCost;
      } else {
        cmd += ' -c 0';
      }
      cmd += ' --json 2>&1';

      const out = execSync(cmd, {
        cwd: '/root/.openclaw/workspace',
        timeout: 5000,
      }).toString();
      log('logged: ' + provider + '/' + model + ' in=' + inputTokens + ' out=' + outputTokens);
    } catch (e) {
      log('error: ' + e.message?.slice(0, 200));
    }
  });

  ctx.on('gateway_stop', async () => {
    try {
      execSync('cs end -n "Gateway stopped" --json 2>/dev/null', {
        cwd: '/root/.openclaw/workspace',
        timeout: 5000,
      });
    } catch {}
  });
}

#!/usr/bin/env node
/**
 * Moltbook Test Suite
 * Validates core functionality
 */

const MoltbookNotionClient = require('../src/notion-client');

async function runTests() {
  console.log('🧪 Moltbook Test Suite\n');
  
  const tests = [
    testEnvironmentVariables,
    testNotionConnection,
    testHandoffWrite,
    testHandoffRead,
    testOrchestratorLoad
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      await test();
      console.log(`✓ ${test.name}`);
      passed++;
    } catch (err) {
      console.log(`✗ ${test.name}: ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

async function testEnvironmentVariables() {
  const required = ['NOTION_TOKEN', 'MOLTBOOK_DB_ID'];
  const missing = required.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }
}

async function testNotionConnection() {
  const client = new MoltbookNotionClient(
    process.env.NOTION_TOKEN,
    process.env.MOLTBOOK_DB_ID
  );
  
  // Try to query the database
  try {
    await client.notion.databases.retrieve({ 
      database_id: process.env.MOLTBOOK_DB_ID 
    });
  } catch (err) {
    throw new Error(`Notion connection failed: ${err.message}`);
  }
}

async function testHandoffWrite() {
  const client = new MoltbookNotionClient(
    process.env.NOTION_TOKEN,
    process.env.MOLTBOOK_DB_ID
  );
  
  const testId = `test-${Date.now()}`;
  
  try {
    const entryId = await client.writeHandoff({
      fromAgent: 'TestAgent',
      toAgent: 'TestAgent2',
      taskId: testId,
      summary: 'Test handoff',
      context: { test: true },
      nextAction: 'Verify test',
      priority: 'low'
    });
    
    if (!entryId) {
      throw new Error('No entry ID returned');
    }
    
    // Clean up test entry
    await client.updateStatus(entryId, 'completed', 'Test complete');
  } catch (err) {
    throw new Error(`Handoff write failed: ${err.message}`);
  }
}

async function testHandoffRead() {
  const client = new MoltbookNotionClient(
    process.env.NOTION_TOKEN,
    process.env.MOLTBOOK_DB_ID
  );
  
  try {
    const handoffs = await client.readPendingHandoffs('TestAgent2');
    
    if (!Array.isArray(handoffs)) {
      throw new Error('Expected array of handoffs');
    }
  } catch (err) {
    throw new Error(`Handoff read failed: ${err.message}`);
  }
}

async function testOrchestratorLoad() {
  const fs = require('fs');
  const path = require('path');
  
  const examplePath = path.join(__dirname, '../examples/blog-workflow/agents.yaml');
  
  if (!fs.existsSync(examplePath)) {
    throw new Error('Example workflow not found');
  }
  
  const content = fs.readFileSync(examplePath, 'utf8');
  
  if (!content.includes('workflow:') || !content.includes('agents:')) {
    throw new Error('Invalid workflow format');
  }
}

runTests();

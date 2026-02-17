/**
 * Notion client for Moltbook operations
 * Handles reading/writing handoff entries to Notion database
 */

const { Client } = require('@notionhq/client');

class MoltbookNotionClient {
  constructor(token, databaseId) {
    this.notion = new Client({ auth: token });
    this.databaseId = databaseId;
  }

  /**
   * Write a handoff entry to the moltbook
   */
  async writeHandoff({
    fromAgent,
    toAgent,
    taskId,
    summary,
    context,
    nextAction,
    priority = 'medium',
    requiresApproval = false
  }) {
    const entry = {
      parent: { database_id: this.databaseId },
      properties: {
        'Task ID': {
          title: [{ text: { content: taskId } }]
        },
        'From Agent': {
          select: { name: fromAgent }
        },
        'To Agent': {
          select: { name: toAgent }
        },
        'Status': {
          select: { name: requiresApproval ? 'pending_approval' : 'pending' }
        },
        'Summary': {
          rich_text: [{ text: { content: summary } }]
        },
        'Next Action': {
          rich_text: [{ text: { content: nextAction } }]
        },
        'Priority': {
          select: { name: priority }
        },
        'Timestamp': {
          date: { start: new Date().toISOString() }
        }
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: `Context: ${JSON.stringify(context, null, 2)}`
                }
              }
            ]
          }
        }
      ]
    };

    const response = await this.notion.pages.create(entry);
    return response.id;
  }

  /**
   * Read pending handoffs for a specific agent
   */
  async readPendingHandoffs(agentName) {
    const response = await this.notion.databases.query({
      database_id: this.databaseId,
      filter: {
        and: [
          {
            property: 'To Agent',
            select: {
              equals: agentName
            }
          },
          {
            property: 'Status',
            select: {
              equals: 'pending'
            }
          }
        ]
      },
      sorts: [
        {
          property: 'Timestamp',
          direction: 'descending'
        }
      ]
    });

    return response.results.map(page => this.parseHandoffEntry(page));
  }

  /**
   * Update handoff status
   */
  async updateStatus(entryId, status, notes = '') {
    const update = {
      page_id: entryId,
      properties: {
        'Status': {
          select: { name: status }
        }
      }
    };

    if (notes) {
      await this.notion.blocks.children.append({
        block_id: entryId,
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: `[${new Date().toISOString()}] ${notes}`
                  }
                }
              ]
            }
          }
        ]
      });
    }

    await this.notion.pages.update(update);
  }

  /**
   * Parse Notion page into handoff entry object
   */
  parseHandoffEntry(page) {
    const props = page.properties;
    return {
      id: page.id,
      taskId: props['Task ID']?.title?.[0]?.text?.content || '',
      fromAgent: props['From Agent']?.select?.name || '',
      toAgent: props['To Agent']?.select?.name || '',
      status: props['Status']?.select?.name || '',
      summary: props['Summary']?.rich_text?.[0]?.text?.content || '',
      nextAction: props['Next Action']?.rich_text?.[0]?.text?.content || '',
      priority: props['Priority']?.select?.name || 'medium',
      timestamp: props['Timestamp']?.date?.start || ''
    };
  }
}

module.exports = MoltbookNotionClient;

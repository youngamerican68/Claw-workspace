const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Initialize SQLite database
const db = new sqlite3.Database('./tasks.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    retries INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create new task
app.post('/api/tasks', (req, res) => {
  const { name, max_retries = 5 } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  
  db.run(
    'INSERT INTO tasks (name, max_retries) VALUES (?, ?)',
    [name, max_retries],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, status: 'pending', retries: 0, max_retries });
    }
  );
});

// Simulate task execution (retry logic)
app.post('/api/tasks/:id/execute', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    if (task.status === 'completed') {
      return res.json({ message: 'Task already completed', task });
    }
    
    if (task.status === 'stuck') {
      return res.json({ message: 'Task is stuck (max retries reached)', task });
    }
    
    // Simulate execution (70% success rate for demo)
    const success = Math.random() > 0.3;
    
    if (success) {
      db.run(
        "UPDATE tasks SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: 'Task completed successfully', task: { ...task, status: 'completed' } });
        }
      );
    } else {
      const newRetries = task.retries + 1;
      const newStatus = newRetries >= task.max_retries ? 'stuck' : 'retrying';
      
      db.run(
        "UPDATE tasks SET status = ?, retries = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [newStatus, newRetries, id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ 
            message: `Task ${newStatus}`, 
            task: { ...task, status: newStatus, retries: newRetries },
            retryIn: newStatus === 'retrying' ? Math.pow(2, newRetries) + 's' : null
          });
        }
      );
    }
  });
});

// Reset stuck task
app.post('/api/tasks/:id/reset', (req, res) => {
  const { id } = req.params;
  db.run(
    "UPDATE tasks SET status = 'pending', retries = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Task reset' });
    }
  );
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Task deleted' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Task Tracker API running on port ${PORT}`);
});

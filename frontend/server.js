const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

app.use(express.json());

// Healthcheck endpoint for Frontend
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'frontend-server', timestamp: new Date().toISOString() });
});

// Render Main App Interface
app.get('/', (req, res) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevOps Practice | Full-Stack 3-Tier App</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-gradient: radial-gradient(circle at 50% -20%, #1e1b4b, #0f172a 60%, #020617);
      --card-bg: rgba(30, 41, 59, 0.7);
      --border-color: rgba(255, 255, 255, 0.1);
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --accent: #10b981;
      --accent-danger: #ef4444;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg-gradient);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem;
    }

    .container {
      width: 100%;
      max-width: 650px;
    }

    header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #818cf8;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }

    h1 {
      font-size: 2.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    p.subtitle {
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    .status-panel {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .status-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .status-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
    }

    .status-value {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #64748b;
    }

    .indicator.online {
      background-color: #10b981;
      box-shadow: 0 0 10px #10b981;
    }

    .indicator.offline {
      background-color: #ef4444;
      box-shadow: 0 0 10px #ef4444;
    }

    .indicator.warning {
      background-color: #f59e0b;
      box-shadow: 0 0 10px #f59e0b;
    }

    .card {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 1.75rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    .form-group {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    input[type="text"] {
      flex: 1;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 0.85rem 1rem;
      color: var(--text-main);
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s ease;
    }

    input[type="text"]:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
    }

    button.btn-add {
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 0.85rem 1.5rem;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    button.btn-add:hover {
      background: var(--primary-hover);
    }

    .todo-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .todo-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 0.85rem 1rem;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }

    .todo-item:hover {
      border-color: rgba(255, 255, 255, 0.2);
    }

    .todo-title {
      font-size: 0.95rem;
      font-weight: 400;
    }

    .btn-delete {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.4rem;
      border-radius: 6px;
      transition: color 0.2s ease, background 0.2s ease;
    }

    .btn-delete:hover {
      color: var(--accent-danger);
      background: rgba(239, 68, 68, 0.1);
    }

    .empty-state {
      text-align: center;
      color: var(--text-muted);
      padding: 2rem 0;
      font-size: 0.9rem;
    }

    footer {
      margin-top: 2.5rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: var(--text-muted);
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <span class="badge">DevOps Practice Starter</span>
      <h1>3-Tier Full-Stack App</h1>
      <p class="subtitle">Frontend (3000) &bull; Backend API (5000) &bull; MongoDB / Fallback</p>
    </header>

    <div class="status-panel">
      <div class="status-item">
        <span class="status-label">Backend Service</span>
        <div class="status-value">
          <span id="backend-indicator" class="indicator"></span>
          <span id="backend-status">Checking...</span>
        </div>
      </div>
      <div class="status-item">
        <span class="status-label">Database</span>
        <div class="status-value">
          <span id="db-indicator" class="indicator"></span>
          <span id="db-status">Checking...</span>
        </div>
      </div>
      <div class="status-item">
        <span class="status-label">Total Todos</span>
        <div class="status-value">
          <span id="todo-count" style="color: var(--primary);">0</span>
        </div>
      </div>
    </div>

    <main class="card">
      <form id="todo-form" class="form-group">
        <input type="text" id="todo-input" placeholder="Add a new task (e.g. Write Dockerfile)..." required />
        <button type="submit" class="btn-add">Add Todo</button>
      </form>

      <ul id="todo-list" class="todo-list">
        <div class="empty-state">Loading tasks...</div>
      </ul>
    </main>

    <footer>
      BACKEND_URL: <span id="backend-url-display">` + BACKEND_URL + `</span>
    </footer>
  </div>

  <script>
    const BACKEND_URL = "` + BACKEND_URL + `";

    const backendIndicator = document.getElementById('backend-indicator');
    const backendStatus = document.getElementById('backend-status');
    const dbIndicator = document.getElementById('db-indicator');
    const dbStatus = document.getElementById('db-status');
    const todoList = document.getElementById('todo-list');
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoCount = document.getElementById('todo-count');

    // Health check function
    async function checkHealth() {
      try {
        const res = await fetch(\`\${BACKEND_URL}/api/health\`);
        if (res.ok) {
          const data = await res.json();
          backendIndicator.className = 'indicator online';
          backendStatus.textContent = 'Online';

          if (data.database && data.database.includes('connected') && !data.database.includes('disconnected')) {
            dbIndicator.className = 'indicator online';
            dbStatus.textContent = 'MongoDB';
          } else {
            dbIndicator.className = 'indicator warning';
            dbStatus.textContent = 'Fallback Array';
          }
        } else {
          throw new Error('Backend health failed');
        }
      } catch (err) {
        backendIndicator.className = 'indicator offline';
        backendStatus.textContent = 'Offline';
        dbIndicator.className = 'indicator offline';
        dbStatus.textContent = 'Disconnected';
      }
    }

    // Fetch Todos
    async function fetchTodos() {
      try {
        const res = await fetch(\`\${BACKEND_URL}/api/todos\`);
        if (!res.ok) throw new Error('Failed to fetch');
        const todos = await res.json();

        todoCount.textContent = todos.length;
        if (todos.length === 0) {
          todoList.innerHTML = '<div class="empty-state">No tasks found. Add your first task above!</div>';
          return;
        }

        todoList.innerHTML = todos.map(todo => \`
          <li class="todo-item" data-id="\${todo._id}">
            <span class="todo-title">\${escapeHtml(todo.title)}</span>
            <button class="btn-delete" onclick="deleteTodo('\${todo._id}')" title="Delete Task">
              &#10005;
            </button>
          </li>
        \`).join('');
      } catch (err) {
        todoList.innerHTML = '<div class="empty-state" style="color: var(--accent-danger);">Unable to connect to backend server at ' + BACKEND_URL + '</div>';
      }
    }

    // Add Todo
    todoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = todoInput.value.trim();
      if (!title) return;

      try {
        const res = await fetch(\`\${BACKEND_URL}/api/todos\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });
        if (res.ok) {
          todoInput.value = '';
          await fetchTodos();
          await checkHealth();
        }
      } catch (err) {
        alert('Failed to add todo. Ensure backend service is reachable.');
      }
    });

    // Delete Todo
    async function deleteTodo(id) {
      try {
        const res = await fetch(\`\${BACKEND_URL}/api/todos/\${id}\`, {
          method: 'DELETE'
        });
        if (res.ok) {
          await fetchTodos();
        }
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Init & Periodic Health Check
    checkHealth();
    fetchTodos();
    setInterval(checkHealth, 5000);
  </script>
</body>
</html>
  `;
  res.send(htmlContent);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Frontend] Express server running on port ${PORT}`);
  console.log(`[Frontend] Configured Backend URL: ${BACKEND_URL}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Log file setup
const logFilePath = path.join(__dirname, 'treebuilder-userlog.txt');
let currentDate = new Date().toISOString().split('T')[0];
let userCount = 0;

// Initialize logs
function initializeLogs() {
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, 'Date,UserCount\n');
  } else {
    const data = fs.readFileSync(logFilePath, 'utf8');
    const entries = data.trim().split('\n');
    const lastEntry = entries[entries.length - 1];
    
    if (lastEntry) {
      const [lastDate, lastCount] = lastEntry.split(',');
      if (lastDate === currentDate) {
        userCount = parseInt(lastCount, 10) || 0;
      }
    }
  }
}

// Update log file
function updateLogFile() {
  const data = fs.readFileSync(logFilePath, 'utf8');
  const entries = data.trim().split('\n');
  const filtered = entries.filter(entry => {
    const [date] = entry.split(',');
    return date !== currentDate;
  });
  filtered.push(`${currentDate},${userCount}`);
  fs.writeFileSync(logFilePath, filtered.join('\n') + '\n');
}

// Daily reset
setInterval(() => {
  const today = new Date().toISOString().split('T')[0];
  if (today !== currentDate) {
    currentDate = today;
    userCount = 0;
    updateLogFile();
    console.log(`[Tree Builder] Date changed to ${currentDate}, reset count to 0`);
  }
}, 60000);

// Routes
app.get('/tree-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tree-builder-dashboard.html'));
});

app.get('/logs', (req, res) => {
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('[Tree Builder] Error reading log file:', err);
      return res.status(500).json({ error: 'Error reading log file' });
    }
    
    try {
      const logs = data.trim().split('\n').slice(1)
        .filter(line => line.trim())
        .map(line => {
          const [date, count] = line.split(',');
          return {
            date: date || 'Unknown',
            count: parseInt(count, 10) || 0
          };
        });
      res.json(logs);
    } catch (parseError) {
      console.error('[Tree Builder] Error parsing logs:', parseError);
      res.status(500).json({ error: 'Error parsing log data' });
    }
  });
});

app.post('/increment-tree', (req, res) => {
  userCount++;
  updateLogFile();
  res.json({ 
    game: 'Tree Builder',
    date: currentDate, 
    count: userCount 
  });
});

// Initialize and start server
initializeLogs();
app.listen(port, () => {
  console.log(`Tree Builder server running on http://localhost:${port}`);
});
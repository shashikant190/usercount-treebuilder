# Tree Builder User Activity Logger and Dashboard 🌳📊

A server-based analytics system for tracking user activity in the Tree Builder game, featuring a real-time dashboard with visual charts and daily user count tracking.
![Demo](public/screenshots/TreeBuilderDashboard.png?text=Dashboard+Preview) 

## Features ✨
- Daily user activity tracking with automatic date reset
- Interactive line chart visualization using Chart.js
- Tabular display of historical data
- Simple REST API endpoints for data management
- Persistent log storage in text file format
- CORS-enabled secure API endpoints

## Installation 🛠️

1. **Prerequisites**
   - Node.js v16+
   - npm v8+

2. **Clone Repository**
   ```bash
   git clone https://https://github.com/shashikant190/usercount-treebuilder.git
   cd usercount-treebuilder
    ```
3. Install dependencies:
```bash
npm install
```

3. Start the server:
```
node server.js
```

<h1>Troubleshooting</h1>
Common issues:

<p>Port in use: Change port number in server.js</p>
<p>Missing dependencies: Run npm install</p>
<p>Empty dashboard: Check server logs and userLogs.txt format</p>
<p>CORS errors: Verify middleware setup in server.js</p>
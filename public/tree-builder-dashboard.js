document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('logChart').getContext('2d');
    let chart;

    async function fetchAndUpdateLogs() {
        try {
            const response = await fetch('http://localhost:3001/logs');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const logs = await response.json();
            
            updateTable(logs);
            updateChart(logs);
        } catch (error) {
            console.error('Error fetching logs:', error);
            displayError();
        }
    }

    function updateTable(logs) {
        const tbody = document.querySelector('#logTable tbody');
        tbody.innerHTML = logs.map(log => `
            <tr>
                <td>${log.date}</td>
                <td>${log.count}</td>
            </tr>
        `).join('');
    }

    function updateChart(logs) {
        if (chart) chart.destroy();
        
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: logs.map(log => log.date),
                datasets: [{
                    label: 'Tree Builder Daily Users',
                    data: logs.map(log => log.count),
                    borderColor: '#1a73e8',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    function displayError() {
        const container = document.querySelector('.dashboard-container');
        container.innerHTML = `
            <div style="color: red; text-align: center; padding: 2rem;">
                Error loading analytics data. Please check:
                <ul style="list-style: none; padding: 1rem;">
                    <li>• Server is running on port 3001</li>
                    <li>• Log file exists at project root</li>
                    <li>• Network connection is active</li>
                </ul>
            </div>
        `;
    }

    // Initial load and refresh every 5 minutes
    fetchAndUpdateLogs();
    setInterval(fetchAndUpdateLogs, 300000);
});
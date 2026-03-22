const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/issues', async (req, res) => {
    const { repo, token } = req.query;
    
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}/issues?labels=user&state=all`, {
            headers: { 
                'Authorization': `token ${token}`,
                'User-Agent': 'Render-Proxy'
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/issues', async (req, res) => {
    const { repo, token, title, body } = req.body;
    
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Render-Proxy'
            },
            body: JSON.stringify({ title, body, labels: ['user'] })
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Proxy Server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

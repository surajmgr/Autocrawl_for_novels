const express = require('express');
const db = require('./utils/db')
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    crossorigin: true
}))

// Routes
const crawl_route = require('./routes/crawlRoute');
const store_route = require('./routes/storeRoute');
const blogger_route = require('./routes/bloggerRoute');

// Routing
app.use('/api/crawl', crawl_route);
app.use('/api/store', store_route);
app.use('/api/blogger', blogger_route);

// Health check for server
app.get('/run', (req, res) => {
    return res.json("Server is running properly.");
})







// Listening server in port 5000
app.listen(5000, (req, res) => {
    console.log("Starting server now!");
})
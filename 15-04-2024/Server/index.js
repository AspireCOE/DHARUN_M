const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(cors());

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'aspireDB'
});

// Middleware to parse JSON requests
app.use(express.json());

// Define route to handle insertion
app.post('/register', async (req, res) => {
    const { name, age, password } = req.body;
    
    try {
        // Connect to MySQL database
        await new Promise((resolve, reject) => {
            connection.connect((err) => {
                if (err) {
                    console.error('Error connecting to MySQL:', err);
                    reject(err);
                    return;
                }
                console.log('Connected to MySQL database');
                resolve();
            });
        });

        // Hash the password
        const passwordHash = await sha256(password);

        // Query to get count
        const countQuery = 'SELECT COUNT(*) AS count FROM login';
        const countResult = await new Promise((resolve, reject) => {
            connection.query(countQuery, (err, results) => {
                if (err) {
                    console.error('Error executing MySQL query:', err);
                    reject(err);
                    return;
                }
                resolve(results[0].count);
            });
        });

        // Generate ID
        const id = countResult + 1;

        // Insert into database
        const insertQuery = `INSERT INTO login (username, password, age, emp_id) VALUES (?, ?, ?, ?)`;
        const insertParams = [name, passwordHash, age, id];
        await new Promise((resolve, reject) => {
            connection.query(insertQuery, insertParams, (err, results) => {
                if (err) {
                    console.error('Error executing MySQL query:', err);
                    reject(err);
                    return;
                }
                console.log('Data added successfully');
                resolve();
            });
        });

        // Close MySQL connection
        connection.end();

        res.status(200).send('Data added successfully');
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('An error occurred');
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        await new Promise((resolve, reject) => {
            connection.connect((err) => {
                if (err) {
                    console.error('Error connecting to MySQL:', err);
                    reject(err);
                    return;
                }
                console.log('Connected to MySQL database');
                resolve();
            });
        });

        const passwordHash = await sha256(password);

        const selectQuery = 'SELECT * FROM login WHERE username = ? AND password = ?';
        const selectParams = [username, passwordHash];
        const results = await new Promise((resolve, reject) => {
            connection.query(selectQuery, selectParams, (err, results) => {
                if (err) {
                    console.error('Error executing MySQL query:', err);
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });

        if (results.length > 0) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('An error occurred');
    } finally {
        connection.end();
    }
});

app.get('/search', async (req, res) => {
    const { q } = req.query;
  
    const options = {
      method: 'GET',
      url: 'https://spotify23.p.rapidapi.com/search/',
      params: {
        q,
        type: 'multi',
        offset: '0',
        limit: '10',
        numberOfTopResults: '5'
      },
      headers: {
        'X-RapidAPI-Key': '60b879abd2mshfe1f2b208523089p188df9jsn6e8a2c7c9ec6',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };
  
    try {
      const response = await axios.request(options);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


// Start server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

// Function to hash password using SHA256
async function sha256(message) {
    const hash = crypto.createHash('sha256');
    hash.update(message);
    return hash.digest('hex');
}

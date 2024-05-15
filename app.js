const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const dataPath = path.join(__dirname, 'data.json');

// Middleware untuk parsing JSON
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Endpoint untuk menambahkan data baru
app.post('/api/addData', (req, res) => {
    const { nama, link } = req.body;
    
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) throw err;
        const jsonData = JSON.parse(data);
        const id = Date.now().toString(); // Menggunakan timestamp sebagai ID unik
        jsonData[id] = { nama, link };

        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) throw err;
            res.json(jsonData);
        });
    });
});

// Endpoint untuk mengambil semua data
app.get('/api/getData', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

// Endpoint untuk mengedit data
app.put('/api/editData/:id', (req, res) => {
    const { id } = req.params;
    const { nama, link } = req.body;

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) throw err;
        const jsonData = JSON.parse(data);
        jsonData[id] = { nama, link };

        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) throw err;
            res.json(jsonData);
        });
    });
});

// Endpoint untuk menghapus data
app.delete('/api/deleteData/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) throw err;
        const jsonData = JSON.parse(data);
        delete jsonData[id];

        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) throw err;
            res.json(jsonData);
        });
    });
});

// Menyajikan file index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

import express from 'express';
import pg from 'pg';

const { Pool } = pg;

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: '123456789',
    port: 5432,
});

app.get('/biodata', (req, res) => {
    pool.query('SELECT * FROM biodata ORDER BY id ASC')
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Database error' });
        });
});
app.get('/biodata/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM biodata WHERE id = $1', [id])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Data tidak ditemukan' });
            }
            res.json(result.rows[0]);
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Database error' });
        });
});

app.post('/biodata', (req, res) => {
    const { nama, nim, kelas } = req.body;
    pool.query(
        'INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3) RETURNING *',
        [nama, nim, kelas]
    )
        .then(result => {
            res.status(201).json({
                message: 'Data berhasil ditambahkan',
                data: result.rows[0]
            });
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Database error' });
        });
});
app.put('/biodata/:id', (req, res) => {
    const { id } = req.params;
    const { nama, nim, kelas } = req.body;
    pool.query(
        'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *',
        [nama, nim, kelas, id]
    )
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Data tidak ditemukan' });
            }
            res.json({
                message: 'Data berhasil diupdate',
                data: result.rows[0]
            });
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Database error' });
        });
});
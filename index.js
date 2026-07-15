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

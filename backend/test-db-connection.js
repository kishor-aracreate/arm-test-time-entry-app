const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
    console.log('Testing database connection with:');
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('Database:', process.env.DB_NAME);
    console.log('User:', process.env.DB_USER);
    console.log('Password:', process.env.DB_PASSWORD ? '***' : 'NOT SET');

    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: 'postgres', // Connect to default postgres database first
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
    });

    try {
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Connection successful!');
        console.log('Server time:', result.rows[0].now);
        await pool.end();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();

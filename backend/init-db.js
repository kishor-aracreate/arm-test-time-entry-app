const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
    // First, connect to postgres database to create timer_app database
    const adminPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: 'postgres',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
    });

    try {
        console.log('🔍 Checking if database exists...');

        // Check if database exists
        const dbCheckResult = await adminPool.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [process.env.DB_NAME || 'timer_app']
        );

        if (dbCheckResult.rows.length === 0) {
            console.log('📦 Creating database...');
            await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME || 'timer_app'}`);
            console.log('✅ Database created successfully');
        } else {
            console.log('✅ Database already exists');
        }

        await adminPool.end();

        // Now connect to the timer_app database to create tables
        const appPool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'timer_app',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
        });

        console.log('📋 Running schema...');
        const schemaPath = path.join(__dirname, 'src', 'config', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await appPool.query(schema);
        console.log('✅ Schema created successfully');

        // Create a default user for testing
        console.log('👤 Creating default user...');
        const userResult = await appPool.query(
            `INSERT INTO users (id, name, email, password_hash) 
             VALUES (1, 'Timer User', 'user@timer.app', 'dummy-hash')
             ON CONFLICT (id) DO NOTHING
             RETURNING id`
        );

        if (userResult.rows.length > 0) {
            console.log('✅ Default user created (ID: 1)');
        } else {
            console.log('✅ Default user already exists');
        }

        await appPool.end();
        console.log('🎉 Database initialization complete!');

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

initDatabase();

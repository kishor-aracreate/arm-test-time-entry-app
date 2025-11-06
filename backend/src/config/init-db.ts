import { pool } from './database';
import fs from 'fs';
import path from 'path';

export const initializeDatabase = async (): Promise<void> => {
    try {
        console.log('🔄 Initializing database schema...');

        // Read the schema SQL file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute the schema
        await pool.query(schemaSql);

        console.log('✅ Database schema initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize database schema:', error);
        throw error;
    }
};

// Run this script directly if called from command line
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('✅ Database initialization complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Database initialization failed:', error);
            process.exit(1);
        });
}
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get database URL from environment variable
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL or NEON_DATABASE_URL environment variable is required');
  console.error('Please set it in your .env file or Netlify environment variables');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function setupDatabase() {
  try {
    console.log('Setting up database schema...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.length > 0) {
        try {
          await sql(statement + ';');
          console.log('✓ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          console.error('Error executing statement:', statement.substring(0, 50) + '...');
          console.error(error.message);
        }
      }
    }
    
    console.log('\nDatabase schema setup complete!');
    console.log('Run "npm run db:import" to import NBA data');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run setup
setupDatabase();
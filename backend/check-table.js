/**
 * Check payment_profile table structure
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function checkTable() {
  try {
    console.log('🔍 Checking payment_profile table structure...\n');

    // Connect via pg directly
    const client = new Client({ connectionString });
    await client.connect();

    // Get table info
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'payment_profile'
      ORDER BY ordinal_position;
    `);

    if (result.rows.length === 0) {
      console.log('❌ Table has no columns or does not exist!');
      console.log('\n📝 Creating payment_profile table...');

      await client.query(`
        CREATE TABLE IF NOT EXISTS payment_profile (
          id BIGSERIAL PRIMARY KEY,
          account_holder VARCHAR(255),
          upi_id VARCHAR(255),
          bank_name VARCHAR(255),
          account_number VARCHAR(255),
          ifsc VARCHAR(20),
          support_phone VARCHAR(20),
          custom_qr_image TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log('✅ Table created!');
    } else {
      console.log('📋 Existing columns:');
      result.rows.forEach(row => {
        console.log(`   - ${row.column_name} (${row.data_type}) ${row.is_nullable ? 'nullable' : 'NOT NULL'}`);
      });
    }

    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkTable();

require('dotenv').config();
const { Client } = require('pg');

const addPricePerNightColumn = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('🔧 Starting migration: Adding price_per_night column...');
    console.log('📡 Connecting to Supabase PostgreSQL...');
    
    await client.connect();
    console.log('✅ Connected to database');

    // Check if column already exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' AND column_name = 'price_per_night'
    `);

    if (checkResult.rows.length > 0) {
      console.log('✅ Column price_per_night already exists!');
      await client.end();
      process.exit(0);
    }

    // Add the column
    console.log('🔨 Adding price_per_night column...');
    await client.query(`
      ALTER TABLE public.bookings 
      ADD COLUMN price_per_night NUMERIC DEFAULT 0 NOT NULL
    `);

    console.log('✅ Column price_per_night added successfully!');
    console.log('');
    console.log('📊 Verifying column...');
    const verifyResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      ORDER BY ordinal_position
    `);

    console.log('✅ Current bookings table columns:');
    verifyResult.rows.forEach(row => {
      console.log(`   - ${row.column_name} (${row.data_type})`);
    });

    await client.end();
    console.log('');
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    process.exit(1);
  }
};

addPricePerNightColumn();

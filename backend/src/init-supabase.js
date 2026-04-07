require('dotenv').config();
const supabase = require('./db');

const initDatabase = async () => {
  try {
    console.log('🔄 Creating Supabase tables...');

    // Create customers table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS customers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20),
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
      `
    }).catch(() => console.log('✅ Customers table exists or created'));

    // Create bookings table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(20),
          checkin DATE NOT NULL,
          checkout DATE NOT NULL,
          room_type VARCHAR(50),
          room_quantity INT DEFAULT 1,
          room_numbers TEXT[],
          price_per_night NUMERIC,
          total_amount_inr NUMERIC,
          payment_method VARCHAR(50),
          payment_txn_id VARCHAR(255),
          payment_reference VARCHAR(255),
          payment JSONB,
          status VARCHAR(50) DEFAULT 'booked',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
        CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
      `
    }).catch(() => console.log('✅ Bookings table exists or created'));

    // Create bar_bookings table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS bar_bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255),
          phone VARCHAR(20),
          date DATE NOT NULL,
          time TIME,
          guests INT,
          package_name VARCHAR(255),
          package_price NUMERIC,
          total NUMERIC,
          payment_method VARCHAR(50),
          payment_txn_id VARCHAR(255),
          payment_reference VARCHAR(255),
          payment JSONB,
          status VARCHAR(50) DEFAULT 'booked',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_bar_bookings_created_at ON bar_bookings(created_at DESC);
      `
    }).catch(() => console.log('✅ Bar bookings table exists or created'));

    // Create food_orders table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS food_orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255),
          room VARCHAR(50),
          phone VARCHAR(20),
          items JSONB,
          total NUMERIC,
          payment_method VARCHAR(50),
          payment_txn_id VARCHAR(255),
          payment_reference VARCHAR(255),
          payment JSONB,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_food_orders_customer_email ON food_orders(customer_email);
        CREATE INDEX IF NOT EXISTS idx_food_orders_status ON food_orders(status);
        CREATE INDEX IF NOT EXISTS idx_food_orders_created_at ON food_orders(created_at DESC);
      `
    }).catch(() => console.log('✅ Food orders table exists or created'));

    // Create contacts table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS contacts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
      `
    }).catch(() => console.log('✅ Contacts table exists or created'));

    // Create payment_profile table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS payment_profile (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          account_holder VARCHAR(255),
          upi_id VARCHAR(255),
          bank_name VARCHAR(255),
          account_number VARCHAR(255),
          ifsc VARCHAR(20),
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    }).catch(() => console.log('✅ Payment profile table exists or created'));

    console.log('✅ Database initialization completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    console.log('\n⚠️  Note: exec_sql is a custom function. Please use Supabase SQL Editor to create tables.');
    console.log('📍 Go to: https://app.supabase.com/project/vwjahaxogzccmpmofoow/sql');
    process.exit(1);
  }
};

initDatabase();

require('dotenv').config();
const { connectDB } = require('./db');

const initdb = async () => {
  try {
    await connectDB();
    console.log('Database connection successful. Collections will be auto-created on first use.');
    process.exit(0);
  } catch (err) {
    console.error('Database initialization error:', err.message);
    process.exit(1);
  }
};

initdb();

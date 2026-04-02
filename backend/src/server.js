require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const healthRoutes = require('./routes/health');
const customerRoutes = require('./routes/customers');
const contactRoutes = require('./routes/contacts');
const bookingRoutes = require('./routes/bookings');
const barBookingRoutes = require('./routes/barBookings');
const foodOrderRoutes = require('./routes/foodOrders');
const paymentProfileRoutes = require('./routes/paymentProfile');
const couponRoutes = require('./routes/coupons');
const reviewRoutes = require('./routes/reviews');
const notificationRoutes = require('./routes/notifications');
const messageRoutes = require('./routes/messages');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    service: 'hms-backend',
    status: 'running',
    database: 'Supabase PostgreSQL',
    docs: '/api/health'
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/bar-bookings', barBookingRoutes);
app.use('/api/food-orders', foodOrderRoutes);
app.use('/api/payment-profile', paymentProfileRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ HMS backend running on 0.0.0.0:${PORT}`);
  console.log(`📦 Database: Supabase PostgreSQL`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);\n});

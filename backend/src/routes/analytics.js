const express = require('express');
const supabase = require('../db');

const router = express.Router();

// Get all analytics data for dashboard
router.get('/', async (req, res) => {
    try {
        // Fetch all bookings
        const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('*');
        
        if (bookingsError) throw bookingsError;

        // Fetch all bar bookings
        const { data: barBookings, error: barError } = await supabase
            .from('bar_bookings')
            .select('*');
        
        if (barError) throw barError;

        // Fetch all food orders
        const { data: foodOrders, error: foodError } = await supabase
            .from('food_orders')
            .select('*');
        
        if (foodError) throw foodError;

        // Calculate weekly revenue (last 12 weeks)
        const monthlyRevenue = calculateWeeklyRevenue(bookings, barBookings);

        // Calculate booking trends (last 30 days)
        const bookingTrends = calculateBookingTrends(bookings);

        // Get most booked room type
        const mostBookedRoom = getMostBookedRoomType(bookings);

        // Get peak booking time
        const peakTime = getPeakBookingTime(bookings);

        // Calculate total revenue
        const totalRevenue = calculateTotalRevenue(bookings, barBookings, foodOrders);

        // Calculate average booking value (total revenue / total transactions)
        const totalTransactions = bookings.length + barBookings.length + foodOrders.length;
        const avgBookingValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

        // Calculate occupancy rate (estimated)
        const occupancyRate = calculateOccupancyRate(bookings);

        res.json({
            monthlyRevenue,
            bookingTrends,
            mostBookedRoom,
            peakTime,
            totalRevenue,
            avgBookingValue,
            occupancyRate,
            totalBookings: bookings.length,
            totalBarBookings: barBookings.length,
            totalFoodOrders: foodOrders.length
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: error.message });
    }
});

function calculateWeeklyRevenue(bookings, barBookings) {
    const weeklyData = {};
    const weekLabels = [];
    
    // Generate last 12 weeks with proper date ranges
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() - (i * 7));
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekStart.getDate() - 6);
        
        // Format: "1-7 Apr" (showing date range with month)
        const startDate = weekStart.getDate();
        const endDate = weekEnd.getDate();
        const monthAbbr = weekStart.toLocaleDateString('en-US', { month: 'short' });
        const label = `${startDate}-${endDate} ${monthAbbr}`;
        
        weekLabels.push(label);
        weeklyData[label] = { start: new Date(weekStart), end: new Date(weekEnd), total: 0 };
    }
    
    // Add room booking revenues
    bookings.forEach(booking => {
        if (booking.totalAmountInr) {
            const bookingDate = new Date(booking.created_at || new Date());
            for (const label in weeklyData) {
                if (bookingDate >= weeklyData[label].start && bookingDate <= weeklyData[label].end) {
                    weeklyData[label].total += Number(booking.totalAmountInr);
                    break;
                }
            }
        }
    });

    // Add bar booking revenues
    barBookings.forEach(booking => {
        if (booking.total) {
            const bookingDate = new Date(booking.created_at || new Date());
            for (const label in weeklyData) {
                if (bookingDate >= weeklyData[label].start && bookingDate <= weeklyData[label].end) {
                    weeklyData[label].total += Number(booking.total);
                    break;
                }
            }
        }
    });

    return {
        labels: weekLabels,
        data: weekLabels.map(label => weeklyData[label].total)
    };
}

function calculateBookingTrends(bookings) {
    const last7Days = {};
    
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        last7Days[dateStr] = 0;
    }

    // Count bookings per day
    bookings.forEach(booking => {
        const date = new Date(booking.created_at || new Date());
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (last7Days.hasOwnProperty(dateStr)) {
            last7Days[dateStr]++;
        }
    });

    return {
        labels: Object.keys(last7Days),
        data: Object.values(last7Days)
    };
}

function getMostBookedRoomType(bookings) {
    const roomTypeCount = {};
    
    bookings.forEach(booking => {
        const roomType = booking.roomType || 'Unknown';
        roomTypeCount[roomType] = (roomTypeCount[roomType] || 0) + (booking.roomQuantity || 1);
    });

    if (Object.keys(roomTypeCount).length === 0) {
        return { type: 'No Data', count: 0 };
    }

    const mostBooked = Object.entries(roomTypeCount).reduce((a, b) => 
        b[1] > a[1] ? b : a
    );

    return { type: mostBooked[0], count: mostBooked[1] };
}

function getPeakBookingTime(bookings) {
    const hours = {};
    
    // Initialize hours
    for (let i = 0; i < 24; i++) {
        hours[i] = 0;
    }

    // Count bookings per hour
    bookings.forEach(booking => {
        const date = new Date(booking.created_at || new Date());
        const hour = date.getHours();
        hours[hour]++;
    });

    return {
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        data: Array.from({length: 24}, (_, i) => hours[i])
    };
}

function calculateTotalRevenue(bookings, barBookings, foodOrders) {
    let total = 0;
    
    // Add room booking revenues
    bookings.forEach(booking => {
        total += Number(booking.totalAmountInr || 0);
    });

    // Add bar booking revenues
    barBookings.forEach(booking => {
        total += Number(booking.total || 0);
    });

    // Add food order revenues
    foodOrders.forEach(order => {
        total += Number(order.total || 0);
    });

    return total;
}

function calculateOccupancyRate(bookings) {
    if (bookings.length === 0) return 0;
    
    let totalRoomNights = 0;
    
    bookings.forEach(booking => {
        if (booking.checkin && booking.checkout) {
            const checkIn = new Date(booking.checkin);
            const checkOut = new Date(booking.checkout);
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            const rooms = booking.roomQuantity || 1;
            totalRoomNights += nights * rooms;
        }
    });

    // Assume 5 rooms available in hotel
    const totalCapacity = 5 * 30 * 1; // 5 rooms, 30 days, 1 month average
    const rate = Math.min(Math.round((totalRoomNights / totalCapacity) * 100), 100);
    
    return rate;
}

module.exports = router;

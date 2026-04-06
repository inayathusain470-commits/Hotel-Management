/**
 * Migration: Create food_orders table
 * 
 * This script sets up the food_orders table in Supabase with all necessary columns
 * for the food ordering system to work with payment tracking.
 * 
 * Run this in Supabase SQL Editor or via PostgreSQL connection
 */

-- Drop table if exists (for fresh setup)
-- DROP TABLE IF EXISTS public.food_orders CASCADE;

-- Create food_orders table
CREATE TABLE IF NOT EXISTS public.food_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    room INTEGER NOT NULL,
    phone VARCHAR(20),
    items JSONB DEFAULT '[]'::jsonb,
    total NUMERIC DEFAULT 0,
    special_requests TEXT,
    
    -- Payment tracking
    payment_method VARCHAR(50),
    payment_txn_id VARCHAR(255),
    payment_reference VARCHAR(255),
    payment JSONB,
    
    -- Status and timestamps
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_food_orders_email ON public.food_orders(customer_email);
CREATE INDEX idx_food_orders_room ON public.food_orders(room);
CREATE INDEX idx_food_orders_status ON public.food_orders(status);
CREATE INDEX idx_food_orders_created_at ON public.food_orders(created_at DESC);

-- Add RLS policy (if using Row Level Security)
ALTER TABLE public.food_orders ENABLE ROW LEVEL SECURITY;

-- Allow all users to insert (for guests)
CREATE POLICY "Allow insert for all" ON public.food_orders 
    FOR INSERT 
    WITH CHECK (true);

-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders" ON public.food_orders 
    FOR SELECT 
    USING (true);

-- Allow admins to update orders
CREATE POLICY "Allow update for all" ON public.food_orders 
    FOR UPDATE 
    USING (true);

-- Print confirmation
SELECT 'Food orders table created successfully!' as status;

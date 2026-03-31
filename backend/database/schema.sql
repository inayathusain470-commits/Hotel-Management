PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    checkin TEXT NOT NULL,
    checkout TEXT NOT NULL,
    room_type TEXT NOT NULL,
    room_quantity INTEGER NOT NULL,
    room_numbers_json TEXT,
    total_amount_inr REAL NOT NULL,
    payment_method TEXT,
    payment_txn_id TEXT,
    payment_reference TEXT,
    payment_json TEXT,
    status TEXT NOT NULL DEFAULT 'booked',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bar_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    customer_email TEXT,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    guests INTEGER NOT NULL,
    package_name TEXT NOT NULL,
    package_price REAL NOT NULL,
    total REAL NOT NULL,
    payment_method TEXT,
    payment_txn_id TEXT,
    payment_reference TEXT,
    payment_json TEXT,
    status TEXT NOT NULL DEFAULT 'booked',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS food_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    customer_email TEXT,
    room TEXT NOT NULL,
    phone TEXT,
    items_json TEXT NOT NULL,
    total REAL NOT NULL,
    payment_method TEXT,
    payment_txn_id TEXT,
    payment_reference TEXT,
    payment_json TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_payment_profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    account_holder TEXT NOT NULL,
    upi_id TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    ifsc TEXT NOT NULL,
    support_phone TEXT,
    custom_qr_image TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO admin_payment_profile (
    id, account_holder, upi_id, bank_name, account_number, ifsc, support_phone, custom_qr_image
) VALUES (
    1, 'Royal Plaza Hotel', 'royalplaza@upi', 'State Bank of India', '123456789012', 'SBIN0001234', '1234567890', ''
);

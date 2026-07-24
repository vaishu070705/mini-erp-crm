CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    business_name VARCHAR(150),
    gst_number VARCHAR(30),
    customer_type VARCHAR(20) NOT NULL,
    address TEXT,
    status VARCHAR(20) DEFAULT 'Lead',
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_followups (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    follow_up_date DATE,
    created_by VARCHAR(100) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'Sales';

UPDATE users
SET role = 'Sales'
WHERE role IS NULL;

ALTER TABLE users
ALTER COLUMN role SET DEFAULT 'Sales';

ALTER TABLE users
ALTER COLUMN role SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_role_check'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT users_role_check
        CHECK (role IN ('Admin', 'Sales', 'Warehouse', 'Accounts'));
    END IF;
END $$;

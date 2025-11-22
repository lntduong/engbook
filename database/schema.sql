-- Engbook Authentication Database Schema
-- Run this script in your Vercel Postgres database

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_expires ON password_reset_tokens(expires);

-- Insert a default admin user (password: admin123)
-- IMPORTANT: Change this password immediately after first login!
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@engbook.com',
  '$2b$10$BJajvulhms4SUgv3jO.BK.R2C0uK8zTCY35VvfrgLetN8XCRn4hai',
  'Admin User',
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Insert a test user with USER role (password: user123)
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'user@engbook.com',
  '$2b$10$BHQgJELGzNKAlush3ovMT./f97HLdEWi9j7W.3UVLvN/c6140s3ZK',
  'Test User',
  'USER'
) ON CONFLICT (email) DO NOTHING;

-- Clean up expired reset tokens (run this periodically or create a cron job)
-- DELETE FROM password_reset_tokens WHERE expires < NOW();

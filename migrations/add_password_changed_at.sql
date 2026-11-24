-- Add password_changed_at column to users table
-- This tracks when the password was last changed, enabling forced logout on all devices
ALTER TABLE users ADD COLUMN password_changed_at DATETIME DEFAULT NULL;

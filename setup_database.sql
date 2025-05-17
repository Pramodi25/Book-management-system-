-- Create database
CREATE DATABASE mydatabase;

-- Create user
CREATE USER myuser WITH PASSWORD '1234567';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;

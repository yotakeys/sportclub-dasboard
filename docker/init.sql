-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birthdate DATE,
    phone VARCHAR(50),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Group-Players junction table
CREATE TABLE IF NOT EXISTS group_players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID NOT NULL,
    player_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players (id) ON DELETE CASCADE
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id UUID NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL, 
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (player_id) REFERENCES players (id) ON DELETE CASCADE
);

-- Presences table (attendance tracking)
CREATE TABLE IF NOT EXISTS presences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id UUID NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (player_id) REFERENCES players (id) ON DELETE CASCADE,
    UNIQUE (player_id, month, year)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_group_players_group_id ON group_players(group_id);
CREATE INDEX IF NOT EXISTS idx_group_players_player_id ON group_players(player_id);
CREATE INDEX IF NOT EXISTS idx_invoices_player_id ON invoices(player_id);
CREATE INDEX IF NOT EXISTS idx_invoices_year_month ON invoices(year, month);
CREATE INDEX IF NOT EXISTS idx_players_is_active ON players(is_active);
CREATE INDEX IF NOT EXISTS idx_presences_player_id ON presences(player_id);
CREATE INDEX IF NOT EXISTS idx_presences_year_month ON presences(year, month);

import { pool } from "./db";

// CREATE DATABASE artist_management;

export async function initDB() {
  try {
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE gender_enum AS ENUM ('m','f','o');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE user_role_enum AS ENUM ('super_admin','artist_manager','artist');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE genre_enum AS ENUM ('rnb','country','classic','rock','jazz');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(500),
        phone VARCHAR(20),
        dob DATE,
        gender gender_enum,
        address VARCHAR(255),
        role user_role_enum DEFAULT 'artist',
        is_active BOOLEAN DEFAULT FALSE,
        activation_token TEXT,
        activation_expires TIMESTAMP,
        profile_complete BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
     CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  artist_manager_id INT REFERENCES users(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  dob DATE,
  gender gender_enum,
  address VARCHAR(255),
  first_release_year INT,
  no_of_albums_released INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `);

    await pool.query(`
     CREATE TABLE IF NOT EXISTS music (
  id SERIAL PRIMARY KEY,
  artist_id INT REFERENCES artists(user_id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  album_name VARCHAR(255),
  genre genre_enum,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("DB Initialization failed:", error);
  }
}
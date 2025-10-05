-- Drop old tables if exist (so no duplicate errors)
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;
DROP TABLE IF EXISTS universities CASCADE;

-- Universities table
CREATE TABLE universities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    website TEXT,
    description TEXT
);

-- Colleges table (Multiple colleges under one university)
CREATE TABLE colleges (
    id SERIAL PRIMARY KEY,
    university_id INT REFERENCES universities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    contact TEXT,
    website TEXT
);

-- Courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    fees TEXT,
    duration TEXT
);

-- Program levels (B.Tech, M.Tech, PhD, etc.)
CREATE TABLE program_levels (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- Update courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
    program_level_id INT REFERENCES program_levels(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    starting_year TEXT
);

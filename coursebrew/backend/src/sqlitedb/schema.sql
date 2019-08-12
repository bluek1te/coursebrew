DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS instructors;
DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS years;
DROP TABLE IF EXISTS users;

CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id TEXT,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name TEXT,
  owner TEXT,
  freq_spr TEXT,
  freq_sum1 TEXT,
  freq_sum2 TEXT,
  freq_fal TEXT,
  freq_spr_l TEXT,
  freq_sum1_l TEXT,
  freq_sum2_l TEXT,
  freq_fal_l TEXT,
  year TEXT,
  token TEXT
);

CREATE TABLE instructors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  net_id TEXT,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name TEXT,
  rank TEXT,
  preps INTEGER,
  wl_credits TEXT,
  wl_courses TEXT,
  summer INTEGER,
  year TEXT,
  preferred_courses TEXT,
  available_courses TEXT,
  owner TEXT,
  token TEXT
);

CREATE TABLE sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id TEXT,
  section_number TEXT,
  instructor_id TEXT DEFAULT 'Unassigned',
  instructor_name TEXT DEFAULT 'Unassigned',
  sem TEXT,
  year TEXT,
  course_name TEXT,
  is_lab TEXT,
  owner TEXT,
  token TEXT,
  lockout TEXT
);

create TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  token TEXT,
  test_password TEXT,
  years TEXT,
  default_year TEXT
);

create TABLE admins(
  token TEXT
);

create TABLE login_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT,
  username TEXT,
  token TEXT,
  default_year TEXT
);
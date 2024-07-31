const inquirer = require('inquirer');
const { Pool } = require('pg');

// Connect to database
const pool = new Pool(
    {
      user: 'postgres',
      password: 'kali',
      host: 'localhost',
      database: 'movie_db'
    },
    console.log(`Connected to the movie_db database.`)
  )
  
  pool.connect();

  
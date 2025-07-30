import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost' ,
    user: process.env.DB_USER || 'dsw',
    password: process.env.DB_PASSWORD || 'dsw',
    database: process.env.DB_NAME || 'heroclash4geeks',
        
})
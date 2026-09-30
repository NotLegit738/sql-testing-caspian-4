import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '87.76.199.91',
  port: 3306,
  user: 'mysql',
  password: 'Q6i9i09QJ41cPp3WDmokudvEhxoQbdLkN3emcMTTfCLDylabaBegOhiUalIxhEOL',
  database: 'default',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS staff_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export default pool;

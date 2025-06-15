import mysql from 'mysql2/promise';

// Asegúrate de que tu archivo .env.local tiene estas variables
// y que coinciden con tu configuración de Docker.
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'userpass',
  database: process.env.DB_DATABASE || 'Gimnasio',
  port: parseInt(process.env.DB_PORT || '3308', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Creamos y exportamos el pool de conexiones.
// Este pool se importará en nuestros repositorios para realizar las consultas.
const pool = mysql.createPool(dbConfig);

export default pool;
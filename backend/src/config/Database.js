const mysql = require('mysql2/promise');

// Detecta el entorno y carga el archivo .env correspondiente
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.local';

require('dotenv').config({ path: envFile });

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
}

// Crear y exportar una instancia única de la base de datos
const database = new Database();

module.exports = database;
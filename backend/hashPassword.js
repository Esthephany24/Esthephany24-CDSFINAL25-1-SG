// hashPassword.js
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function hashPasswordAndUpdate(email, plainPassword) {
  const contraseña_hash = await bcrypt.hash(plainPassword, 10);
  const connection = await mysql.createConnection({
    host: 'maglev.proxy.rlwy.net',
    user: 'root',
    password: 'VWuQIwcVnBMSmHByhyCDwbmPUyFnjPTQ',
    database: 'railway',
    port: 35305
  });
  await connection.execute(
    'UPDATE UsuariosSistema SET contraseña_hash = ? WHERE email = ?',
    [contraseña_hash, email]
  );
  await connection.end();
}

hashPasswordAndUpdate('ana@mail.com', '123456');
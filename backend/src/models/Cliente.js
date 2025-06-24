const database = require('../config/Database');

class Cliente {
  static async ObtenerTodosLosClientes() {
    const [rows] = await database.pool.query('SELECT * FROM Clientes');
    return rows;
  }

  static async ObtenerClientePorDni(dni) {
    const [rows] = await database.pool.query('SELECT * FROM Clientes WHERE dni = ?', [dni]);
    return rows[0];
  }

  static async AgregarCliente(data) {
    const { dni, tipo_cliente } = data;
    await database.pool.query(
      'INSERT INTO Clientes (dni, tipo_cliente) VALUES (?, ?)',
      [dni, tipo_cliente]
    );
  }

  static async ActualizarCliente(dni, data) {
    const { tipo_cliente } = data;
    await database.pool.query(
      'UPDATE Clientes SET tipo_cliente=? WHERE dni=?',
      [tipo_cliente, dni]
    );
  }

  static async EliminarCliente(dni) {
    await database.pool.query('DELETE FROM Clientes WHERE dni=?', [dni]);
  }
}

module.exports = Cliente;
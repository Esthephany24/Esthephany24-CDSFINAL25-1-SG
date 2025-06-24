const database = require('../config/Database');

class Empleado {
  static async ObtenerTodosLosEmpleados() {
    const [rows] = await database.pool.query('SELECT * FROM Empleados');
    return rows;
  }

  static async ObtenerEmpleadoPorId(id) {
    const [rows] = await database.pool.query('SELECT * FROM Empleados WHERE cod_empleado = ?', [id]);
    return rows[0];
  }

  static async AgregarEmpleado(data) {
    const { dni, contraseña, es_administrador } = data;
    await database.pool.query(
      'INSERT INTO Empleados (dni, contraseña, es_administrador) VALUES (?, ?, ?)',
      [dni, contraseña, es_administrador ? 1 : 0]
    );
  }

  static async ActualizarEmpleado(id, data) {
    const { dni, contraseña, es_administrador } = data;
    await database.pool.query(
      'UPDATE Empleados SET dni=?, contraseña=?, es_administrador=? WHERE cod_empleado=?',
      [dni, contraseña, es_administrador ? 1 : 0, id]
    );
  }

  static async EliminarEmpleado(id) {
    await database.pool.query('DELETE FROM Empleados WHERE cod_empleado=?', [id]);
  }
}

module.exports = Empleado;
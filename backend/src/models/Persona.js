const database = require('../config/Database');

class Persona {
  static async ObtenerTodasLasPersonas() {
    const [rows] = await database.pool.query('SELECT * FROM Personas');
    return rows;
  }

  static async ObtenerPersonaPorDni(dni) {
    const [rows] = await database.pool.query('SELECT * FROM Personas WHERE dni = ?', [dni]);
    return rows[0];
  }

  static async AgregarPersona(data) {
    const {
      dni,
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      direccion,
      telefono
    } = data;

    const connection = await database.pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        'INSERT INTO Personas (dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento) VALUES (?, ?, ?, ?, ?)',
        [dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento]
      );

      if (direccion) {
        await connection.query('CALL AgregarDireccionPersona(?, ?)', [dni, direccion]);
      }

      if (telefono) {
        await connection.query('CALL AgregarTelefonoPersona(?, ?)', [dni, telefono]);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async ActualizarPersona(dni, data) {
    const { nombre, apellido_paterno, apellido_materno, fecha_nacimiento } = data;
    await database.pool.query(
      'UPDATE Personas SET nombre=?, apellido_paterno=?, apellido_materno=?, fecha_nacimiento=? WHERE dni=?',
      [nombre, apellido_paterno, apellido_materno, fecha_nacimiento, dni]
    );
  }

  static async EliminarPersona(dni) {
    await database.pool.query('DELETE FROM Personas WHERE dni=?', [dni]);
  }
}

module.exports = Persona;
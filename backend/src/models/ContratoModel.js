const db = require('../config/Database');

const ContratoModel = {
  async obtenerTodos() {
    const [rows] = await db.pool.query('SELECT * FROM Contratos');
    return rows;
  },
  async obtenerTodosConNombre() {
    const [rows] = await db.pool.query('CALL ObtenerTodosLosContratos()');
    return rows[0]; // El resultado de CALL es un array de arrays
  },
  async obtenerPorId(cod_contrato) {
    const [rows] = await db.pool.query('SELECT * FROM Contratos WHERE cod_contrato = ?', [cod_contrato]);
    return rows[0];
  },
  async crear(contrato) {
    const { cod_empleado, fecha_inicio, fecha_fin, salario_men, observaciones, estado } = contrato;
    const [result] = await db.pool.query(
      'INSERT INTO Contratos (cod_empleado, fecha_inicio, fecha_fin, salario_men, observaciones, estado) VALUES (?, ?, ?, ?, ?, ?)',
      [cod_empleado, fecha_inicio, fecha_fin, salario_men, observaciones, estado || 'activo']
    );
    return result;
  },
  async actualizar(cod_contrato, contrato) {
    const { cod_empleado, fecha_inicio, fecha_fin, salario_men, observaciones, estado } = contrato;
    const [result] = await db.pool.query(
      'UPDATE Contratos SET cod_empleado=?, fecha_inicio=?, fecha_fin=?, salario_men=?, observaciones=?, estado=? WHERE cod_contrato=?',
      [cod_empleado, fecha_inicio, fecha_fin, salario_men, observaciones, estado, cod_contrato]
    );
    return result;
  },
  async eliminar(cod_contrato) {
    const [result] = await db.pool.query('DELETE FROM Contratos WHERE cod_contrato = ?', [cod_contrato]);
    return result;
  }
};

module.exports = ContratoModel;
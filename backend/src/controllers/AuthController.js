const db = require('../config/Database');
const bcrypt = require('bcrypt');

const AuthController = {
  async login(req, res) {
    try {
      const { email, contraseña } = req.body;
      // Buscar usuario por email
      const [rows] = await db.pool.query(
        'SELECT * FROM UsuariosSistema WHERE email = ?',
        [email]
      );
      if (!rows.length) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      const usuario = rows[0];
      // Comparar contraseña
      const match = await bcrypt.compare(contraseña, usuario.contraseña_hash);
      if (!match) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      // Puedes retornar datos básicos del usuario
      res.json({
        message: 'Login exitoso',
        usuario: {
          email: usuario.email,
          rol: usuario.rol,
          dni: usuario.dni
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async signup(req, res) {
    try {
      const {
        dni, nombre, apellido_paterno, apellido_materno,
        fecha_nacimiento, telefono, direccion, email, contraseña, rol
      } = req.body;

      // Hashear la contraseña antes de enviarla al procedimiento
      const contraseña_hash = await bcrypt.hash(contraseña, 10);

      // Llamar al procedimiento almacenado
      await db.pool.query(
        `CALL RegistrarNuevoUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dni,
          nombre,
          apellido_paterno,
          apellido_materno,
          fecha_nacimiento,
          telefono,
          direccion,
          email,
          contraseña_hash,
          rol
        ]
      );

      res.json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = AuthController;
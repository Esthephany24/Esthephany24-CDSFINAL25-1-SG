const express = require('express');
const cors = require('cors');

// Configuración de variables de entorno
require('dotenv').config({ path: '.env.local' });

// Base de datos
const database = require('./src/config/Database');

// Rutas
const clienteRoutes = require('./src/routes/ClienteRoute');
const empleadoRoutes = require('./src/routes/EmpleadoRoute');
const productoRoutes = require('./src/routes/ProductoRoute');
const lineaRoutes = require('./src/routes/LineaRoute');
const categoriaRoutes = require('./src/routes/CategoriaRoute');
const proveedorRoutes = require('./src/routes/ProveedorRoute');
const personaRoutes = require('./src/routes/PersonaRoute');
const contratoRoutes = require('./src/routes/ContratoRoute');
const authRoutes = require('./src/routes/AuthRoute');

const app = express();

// Configuración de CORS (temporalmente permitiendo todos los orígenes para pruebas)
const corsOptions = {
  origin: [
    'https://fabianatura.vercel.app',
    'http://localhost:5173',
    'https://sistemagestion-i3rlft3zc-esthephany24s-projects.vercel.app',
    'https://sistemagestion.vercel.app' // <---  ESTE
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'Expires'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Log para depuración
console.log('Configuración CORS:', {
  origin: corsOptions.origin,
  methods: corsOptions.methods,
  allowedHeaders: corsOptions.allowedHeaders
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// 👉 Aquí ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Backend funcionando correctamente!');
});

// Ruta de verificación de salud de la base de datos
app.get('/api/health', async (req, res) => {
  try {
    const connection = await database.pool.getConnection();
    await connection.ping();
    connection.release();
    res.status(200).json({ 
      status: 'OK',
      database: 'Conectado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({ 
      status: 'Error',
      database: 'Error de conexión',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Rutas de la API
app.use('/api/productos', productoRoutes);
app.use('/api/lineas', lineaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api/auth', authRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

// Función para verificar la conexión a la base de datos
async function checkDatabaseConnection() {
  try {
    const connection = await database.pool.getConnection();
    await connection.ping();
    connection.release();
    return { connected: true, message: '✅ Conectado a la base de datos' };
  } catch (error) {
    return { 
      connected: false, 
      message: '❌ Error de conexión a la base de datos',
      error: error.message 
    };
  }
}

// Iniciar el servidor
const server = app.listen(PORT, async () => {
  const dbStatus = await checkDatabaseConnection();
  console.log('='.repeat(60));
  console.log(`🚀 Servidor listo en el puerto: ${PORT}`);
  console.log('📊 Estado de la base de datos:');
  console.log(`   ${dbStatus.message}`);
  if (!dbStatus.connected) {
    console.log(`   Error: ${dbStatus.error}`);
  }
  console.log('='.repeat(60));
  console.log('📡 Algunos endpoints disponibles:');
  console.log(`   - GET  /api/health        Verificar estado del servidor`);
  console.log(`   - GET  /api/productos     Obtener productos`);
  console.log(`   - GET  /api/lineas        Obtener líneas`);
  console.log(`   - GET  /api/categorias    Obtener categorías`);
  console.log(`   - GET  /api/proveedores   Obtener proveedores`);
  console.log(`   - GET  /api/clientes      Obtener clientes`);
  console.log(`   - GET  /api/empleados     Obtener empleados`);
  console.log(`   - GET  /api/personas      Obtener personas`); 
  console.log(`   - GET  /api/contratos     Obtener contratos`);
  
  console.log('='.repeat(60));
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
  server.close(() => process.exit(1));
});
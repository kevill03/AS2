require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const db = require('./db'); // 👈 Aquí importas la conexión a la BD

const app = express();
const port = process.env.PORT || 3000;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware de CORS
app.use(cors({
  origin: 'http://localhost:5500',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Servir archivos estáticos (opcional)
app.use(express.static(__dirname));

// Configurar Multer (subida temporal)
const upload = multer({ dest: 'temp_uploads/' });

// Ruta principal
app.get('/', (req, res) => {
  res.send('Servidor con Cloudinary funcionando.');
});

// Ruta de subida de archivos
app.post('/upload', upload.single('archivo'), async (req, res) => {
  console.log('📥 Archivo recibido:', req.file);

  if (!req.file) {
    return res.status(400).json({ mensaje: 'No se recibió ningún archivo.' });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'archivos-subidos'
    });

    console.log('✅ Subido a Cloudinary:', result.secure_url);

    // Eliminar archivo temporal
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.warn('⚠️ No se pudo eliminar el archivo temporal:', err);
      } else {
        console.log('🧹 Archivo temporal eliminado.');
      }
    });

    // Guardar en la base de datos
    const query = 'INSERT INTO archivos (url, public_id) VALUES (?, ?)';
    db.query(query, [result.secure_url, result.public_id], (err, rows) => {
      if (err) {
        console.error('❌ Error guardando en la base de datos:', err);
        return res.status(500).json({ mensaje: 'Error al guardar en la base de datos.' });
      }

      return res.status(200).json({
        mensaje: 'Archivo subido y guardado correctamente.',
        url: result.secure_url,
        public_id: result.public_id
      });
    });

  } catch (error) {
    console.error('❌ Error subiendo a Cloudinary:', error);

    return res.status(500).json({
      mensaje: 'Error al subir archivo a Cloudinary.',
      error: error.message
    });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});




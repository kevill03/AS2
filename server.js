require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware de CORS (mejor configurado)
app.use(cors({
  origin: 'http://localhost:5500', // <- permitir solo ese origen
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Middleware para servir archivos estáticos (por si decides alojar HTML aquí)
//app.use(express.static(path.join(__dirname, 'public')));

// 👉 Sirve archivos estáticos desde la raíz del proyecto
app.use(express.static(__dirname));
// Configurar Multer para subir archivos temporalmente
const upload = multer({ dest: 'temp_uploads/' });

// Ruta principal
app.get('/', (req, res) => {
  res.send('Servidor con Cloudinary funcionando.');
});

// Ruta de subida
app.post('/upload', upload.single('archivo'), async (req, res) => {
  console.log('📥 Archivo recibido:', req.file);

  if (!req.file) {
    return res.status(400).json({
      mensaje: 'No se recibió ningún archivo.'
    });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'archivos-subidos'
    });

    console.log('✅ Subido a Cloudinary:', result.secure_url);

    // Eliminar archivo temporal de forma segura
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.warn('⚠️ No se pudo eliminar el archivo temporal:', err);
      } else {
        console.log('🧹 Archivo temporal eliminado.');
      }
    });

    return res.status(200).json({
      mensaje: 'Archivo subido correctamente a Cloudinary.',
      url: result.secure_url,
      public_id: result.public_id
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




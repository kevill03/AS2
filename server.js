require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(cors()); // Permite todos los orígenes, útil para Railway u otros clientes remotos
app.use(express.static(__dirname));

// Multer para archivos temporales
const upload = multer({ dest: 'temp_uploads/' });

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servidor con Cloudinary funcionando.');
});

// Subida de archivo
app.post('/upload', upload.single('archivo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ mensaje: 'No se recibió ningún archivo.' });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'archivos-subidos'
    });

    // Eliminar archivo local temporal
    fs.unlink(req.file.path, (err) => {
      if (err) console.warn('⚠️ No se pudo eliminar archivo temporal:', err);
    });

    // Guardar en la base de datos
    const query = 'INSERT INTO archivos (url, public_id, fecha_subida) VALUES (?, ?, NOW())';
    db.query(query, [result.secure_url, result.public_id], (err) => {
      if (err) {
        console.error('❌ Error al guardar en la base de datos:', err);
        return res.status(500).json({ mensaje: 'Error al guardar en la base de datos.' });
      }

      res.status(200).json({
        mensaje: 'Archivo subido y guardado correctamente.',
        url: result.secure_url,
        public_id: result.public_id
      });
    });

  } catch (error) {
    console.error('❌ Error subiendo a Cloudinary:', error);
    res.status(500).json({ mensaje: 'Error al subir archivo a Cloudinary.', error: error.message });
  }
});

// Obtener archivos
app.get('/archivos', (req, res) => {
  db.query('SELECT * FROM archivos ORDER BY fecha_subida DESC', (err, rows) => {
    if (err) {
      console.error('❌ Error al consultar archivos:', err);
      return res.status(500).json({ mensaje: 'Error al consultar archivos.' });
    }
    res.json(rows);
  });
});

// Eliminar archivo
app.delete('/delete/:publicId', (req, res) => {
  const { publicId } = req.params;

  cloudinary.uploader.destroy(publicId)
    .then(() => {
      db.query('DELETE FROM archivos WHERE public_id = ?', [publicId], (err) => {
        if (err) {
          console.error('❌ Error al eliminar de la base de datos:', err);
          return res.status(500).json({ mensaje: 'Error al eliminar archivo' });
        }
        res.json({ mensaje: 'Archivo eliminado con éxito' });
      });
    })
    .catch(err => {
      console.error('❌ Error al eliminar de Cloudinary:', err);
      res.status(500).json({ mensaje: 'Error al eliminar archivo' });
    });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${port}`);
});






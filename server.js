const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configurar Multer (middleware para subir archivos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan los archivos
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Ruta principal
app.get('/', (req, res) => {
  res.send('Servidor en ejecución. Usa POST /upload para subir archivos.');
});

// Ruta para subir archivos
const cors = require('cors');
app.use(cors());

app.post('/upload', upload.single('archivo'), (req, res) => {
  res.json({
    mensaje: 'Archivo subido correctamente.',
    nombre: req.file.filename,
    ruta: `/uploads/${req.file.filename}`
  });
});

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

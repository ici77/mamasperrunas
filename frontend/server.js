const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Ruta a los archivos compilados de Angular
const frontendPath = path.join(__dirname, 'dist', 'frontend', 'browser');

// Servir archivos estáticos
app.use(express.static(frontendPath));

// Ruta fallback para SPA (Angular maneja las rutas del frontend)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Angular corriendo en puerto ${port}`);
});

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos de Angular (desde dist/frontend/browser dentro de esta carpeta)
app.use(express.static(path.join(__dirname, 'dist/frontend/browser')));

// Redirigir cualquier otra ruta al index.html (para soporte de Angular routing)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/frontend/browser/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

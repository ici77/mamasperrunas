const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para servir archivos estáticos de Angular
app.use(express.static(path.join(__dirname, 'dist/frontend/browser')));

// Redirigir todas las rutas al index.html (para soporte de Angular routing)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/frontend/browser/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos de Angular
app.use(express.static(path.join(__dirname, 'dist/frontend/browser')));

// Ruta para devolver index.html si no se encuentra otro recurso
app.get('*', (req, res) => {
 res.sendFile(path.join(__dirname, 'dist/frontend/browser/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

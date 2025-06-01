const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Ruta al contenido compilado de Angular
app.use(express.static(path.join(__dirname, 'dist/frontend/browser')));

// Redirige cualquier petición a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/frontend/browser/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

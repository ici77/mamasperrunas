const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Ruta absoluta a la carpeta de distribución de Angular
app.use(express.static(path.join(__dirname, 'dist/frontend/browser')));

// Redirigir todas las rutas al index.html de Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/frontend/browser/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

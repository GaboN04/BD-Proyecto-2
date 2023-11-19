const express = require('express');
const app = express();
const port = 3000;
const Controller = require('./controlador');

app.use(express.static('public'));

const controller = new Controller();
controller.conectar();


app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});


// Endpoint para obtener datos
app.get('/datos', (req, res) => {
  controller.obtenerDatos((error, datos) => {
    if (error) {
      res.status(500).send('Error al obtener datos');
    } else {
      res.json(datos);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});


// Endpoint para obtener datos
app.get('/datos', (req, res) => {
  const { searchInput } = req.query;

  controller.obtenerDatos(searchInput, (error, paginas) => {
    if (error) {
      res.status(500).send('Error al obtener datos');
    } else {
      res.json(paginas);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});

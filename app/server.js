const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser'); // Import body-parser
const port = 3000;
const Controller = require('./controlador');

app.use(express.static('public'));

const controller = new Controller();
controller.conectar();
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Esto permite todas las solicitudes, puedes ajustarlo a tus necesidades
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

var paginas = []
// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/'); // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(null, Date.now() + extname); // Renombrar el archivo con una marca de tiempo
    }
});
const upload = multer({ storage: storage });

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});


// Endpoint para obtener datos
app.get('/estadisticas', (req, res) => {
  // Obtener estadísticas utilizando las funciones de tu controlador
  Promise.all([
    controller.promedioDeTitulosPorPagina(),
    controller.promedioDePalabrasPorPagina(),
    controller.promedioDeReferenciasPorPagina(),
    controller.promedioDeAltPorPagina(),
  ])
    .then(([promedioSubtitulos, promedioPalabras, promedioReferenciasConEnlaces, promedioImgAlt]) => {
      // Enviar las estadísticas como respuesta
      console.log([promedioSubtitulos, promedioPalabras, promedioReferenciasConEnlaces, promedioImgAlt]);
      res.json({
        promedioSubtitulos,
        promedioPalabras,
        promedioReferenciasConEnlaces,
        promedioImgAlt,
      });
    })
    .catch(error => {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).send('Error al obtener estadísticas');
    });
});


app.post('/buscar', async (req, res) => {
  const palabras = req.body.data;
  //console.log(palabras);
  let arrayResultado = palabras.split(",");
  var resultados = []
  try {
    resultados = await Promise.all(arrayResultado.map(palabra => controller.getResultadosPalabra(palabra)));
    paginas = resultados;
    res.redirect("buscador.html");
  }catch (error) {
    console.error('Error al buscar:', error);
  }
});

app.get('/buscar', (req, res) => {
  res.json(paginas);
});
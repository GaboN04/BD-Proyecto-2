const mysql = require('mysql');

function initConnection(){
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mariadb',
        database: 'BD'
      });
    return connection;
}

class Controller {
  constructor() {
    this.connection = initConnection();
  }

  conectar() {
    this.connection.connect((err) => {
      if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
      }
      console.log('Conexión a la base de datos establecida');
    });
  }

  desconectar() {
    this.connection.end();
  }

  promedioDeTitulosPorPagina() {
    return new Promise((resolve, reject) => {
      const query = "SELECT AVG(subtitulos) AS promedio FROM pagina";
      this.connection.query(query, (err, result, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0].promedio || 0);
        }
      });
    });
  }
    promedioDePalabrasPorPagina(){
      const totalPalabras = 0;
      const cantidadPaginas = 0;
      con.query("SELECT cantidad_palabras FROM pagina", function (err, result, fields) {
        if (err) throw err;
        result.forEach(function (row){
          totalPalabras=totalPalabras + row.cantidad_palabras;
          cantidadPaginas++;
        })
      });
      return totalPalabras/cantidadPaginas;
    }
    promedioDeReferenciasPorPagina(){
      const totalReferencias = 0;
      const cantidadPaginas = 0;
      con.query("SELECT cantidad_referencias FROM pagina", function (err, result, fields) {
        if (err) throw err;
        result.forEach(function (row){
          totalReferencias=totalReferencias + row.cantidad_referencias;
          cantidadPaginas++;
        })
      });
      return totalReferencias/cantidadPaginas;
    }
    promedioDeAltPorPagina(){
      const totalAlt = 0;
      const cantidadPaginas = 0;
      con.query("SELECT alt FROM pagina", function (err, result, fields) {
        if (err) throw err;
        result.forEach(function (row){
          totalAlt=totalAlt + row.cantidad_alt;
          cantidadPaginas++;
        })
      });
      return totalAlt/cantidadPaginas;
    }
    top3Palabras(){
      const topPalabras = [];
      const cantidadPaginas = 0;
      con.query("SELECT atributo, cantidad FROM pagina ORDER BY cantidad", function (err, result, fields) {
        if (err) throw err;
        topPalabras.push(result[0].atributo);
        topPalabras.push(result[1].atributo);
        topPalabras.push(result[2].atributo);
      });
      return topPalabras
    }
    getPaginasPalabra(palabra){
      const paginas = [];
      con.query(`SELECT pagina.titulo, palabra.id_pagina, pagina.id FROM palabra WHERE palabra=${palabra} INNER JOIN pagina ON palabra.id_pagina = pagina.id`, function (err, result, fields) {
        if (err) throw err;
        result.forEach(function (row){
          paginas.push(row.titulo)
        })
      });
      return paginas;
    }
    
}



/* *************  ESTADISTICAS  ************* */

/*

// Función para ejecutar queries en la base de datos
function runQuery(query, params, callback) {
  connection.query(query, params, (error, results, fields) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
}

// Función para calcular el promedio de subtítulos
function promedioSubtitulos(req, res) {
  const query = 'SELECT AVG(subtitulos) as promedio FROM pagina';
  runQuery(query, [], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el promedio de subtítulos.' });
    } else {
      res.json(results[0]);
    }
  });
}

// Función para calcular el promedio de palabras por página
function promedioPalabras(req, res) {
  const query = 'SELECT AVG(cantidad_palabras) as promedio FROM pagina';
  runQuery(query, [], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el promedio de palabras por página.' });
    } else {
      res.json(results[0]);
    }
  });
}

// Función para calcular el promedio de referencias por página
function promedioReferencias(req, res) {
  const query = 'SELECT AVG(cantidad_referencias) as promedio FROM pagina';
  runQuery(query, [], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el promedio de referencias por página.' });
    } else {
      res.json(results[0]);
    }
  });
}

// Función para calcular el promedio de imágenes con alt
function promedioImagenesAlt(req, res) {
  const query = 'SELECT AVG(CASE WHEN alt IS NOT NULL AND alt != "" THEN 1 ELSE 0 END) as promedio FROM imagen';
  runQuery(query, [], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el promedio de imágenes con alt.' });
    } else {
      res.json(results[0]);
    }
  });
}

module.exports = {
  promedioSubtitulos,
  promedioPalabras,
  promedioReferencias,
  promedioImagenesAlt
};

*/
module.exports = Controlador;

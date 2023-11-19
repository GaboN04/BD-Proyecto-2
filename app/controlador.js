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
    conectar(){
        connection.connect((err) => {
            if (err) {
              console.error('Error al conectar a la base de datos:', err);
              return;
            }
            console.log('Conexión a la base de datos establecida');
        });
    }
}


const obtenerDatos = (palabra, callback) => {
    const query = `
        SELECT 
        palabra.atributo AS palabra,
        pagina.titulo,
        palabra.cantidad AS cantidadPalabras,
        pagina.subtitulos AS cantidadSubtitulos,
        pagina.cantidad_referencias AS cantidadReferencias
    FROM palabra
    JOIN pagina ON palabra.id_pagina = pagina.id
    WHERE palabra.atributo = ?;  
    `;
  
    connection.query(query, [palabra], (error, results, fields) => {
      if (error) {
        callback(error, null);
      } else {
        // Mapear los resultados a instancias de la clase Pagina
        const paginas = results.map(result => {
          return new Pagina(
            result.titulo,
            result.cantidadPalabras,
            result.cantidadSubtitulos,
            result.cantidadReferencias
          );
        });
  
        callback(null, paginas);
      }
    });
  };

module.exports = Controlador;

const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mariadb',
  database: 'BD'
});

const obtenerIdPagina = (titulo, callback) => {
  const selectQuery = 'SELECT id FROM pagina WHERE titulo = ?';
  connection.query(selectQuery, [titulo], (error, results, fields) => {
    if (error) {
      callback(error, null);
    } else {
      if (results.length > 0) {
        callback(null, results[0].id);
      } else {
        const insertPaginaQuery = 'INSERT INTO pagina (titulo) VALUES (?)';
        connection.query(insertPaginaQuery, [titulo], (error, results, fields) => {
          if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
              obtenerIdPagina(titulo, callback);
            } else {
              callback(error, null);
            }
          } else {
            callback(null, results.insertId);
          }
        });
      }
    }
  });
};

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');

  fs.readFile('cienMil', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      connection.end();
      return;
    }

    const lineas = data.split('\n');
    
    const datosOrganizados = lineas.map(linea => {
      if (linea.trim() === '') {
        return null;
      }
      const [palabra, titulo, cantidad, apareceEnTitulo] = linea.split('\t');
      return {
        palabra: palabra,
        titulo: titulo,
        cantidad: parseInt(cantidad),
        apareceEnTitulo: parseInt(apareceEnTitulo)
      };
    }).filter(Boolean);

    let insercionesCompletadas = 0;

    function insertOrUpdatePalabra(palabra, idPagina, cantidad, apareceEnTitulo, callback) {
      const selectPalabraQuery = 'SELECT id FROM palabra WHERE atributo = ? AND id_pagina = ?';
      connection.query(selectPalabraQuery, [palabra, idPagina], (error, results, fields) => {
        if (error) {
          callback(error, null);
        } else {
            const insertPalabraQuery = 'INSERT INTO palabra (atributo, id_pagina, cantidad, aparece_en_titulo) VALUES (?, ?, ?, ?)';
            connection.query(insertPalabraQuery, [palabra, idPagina, cantidad, apareceEnTitulo], (error, results, fields) => {
              if (error) {
                callback(error, null);
              } else {
                callback(null, results.insertId);
              }
            });
        }
      });
    }

    datosOrganizados.forEach(({ palabra, cantidad, apareceEnTitulo, titulo }) => {
      obtenerIdPagina(titulo, (error, idPagina) => {
        if (error) {
          console.error('Error al obtener/insertar la página:', error);
          connection.end();
          return;
        }

        insertOrUpdatePalabra(palabra, idPagina, cantidad, apareceEnTitulo, (error, palabraId) => {
          if (error) {
            console.error('Error al insertar/actualizar palabra:', error);
          } else {
            //console.log('Palabra insertada/actualizada con éxito. ID:', palabraId);
          }

          insercionesCompletadas++;
          if (insercionesCompletadas === datosOrganizados.length) {
            connection.end();
          }
        });
      });
    });
  });
});

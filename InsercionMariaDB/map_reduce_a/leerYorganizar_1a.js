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

  fs.readFile('part-00000-1a', 'utf-8', (err, data) => {
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
      const [titulo, cantidad] = linea.split('\t');
      if (titulo && cantidad) {
        return [titulo, parseInt(cantidad, 10) || 0];
      } else {
        console.error('No se pudo analizar la línea:', linea);
        return null;
      }
    }).filter(Boolean);

    let insercionesCompletadas = 0;

    datosOrganizados.forEach(([titulo, cantidad]) => {
      obtenerIdPagina(titulo, (error, idPagina) => {
        if (error) {
          console.error('Error al obtener/insertar la página:', error);
          connection.end();
          return;
        }

        const updateQuery = 'UPDATE pagina SET subtitulos = ? WHERE id = ?';
        const values = [cantidad, idPagina];

        connection.query(updateQuery, values, (error, results, fields) => {
          if (error) {
            console.error('Error al actualizar datos en la tabla "pagina":', error);
          } else {
            //console.log('Datos actualizados con éxito en la tabla "pagina".');
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
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

  fs.readFile('part-00000-c', 'utf-8', (err, data) => {
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
      const [pagina, cantidad] = linea.split('\t');
      if (pagina && cantidad) {
        return [pagina, parseInt(cantidad, 10) || 0];
      } else {
        console.error('No se pudo analizar la línea:', linea);
        return null;
      }
    }).filter(value => value !== null);

    let actualizacionesCompletadas = 0;

    datosOrganizados.forEach(([pagina, cantidad]) => {
      obtenerIdPagina(pagina, (error, idPagina) => {
        if (error) {
          console.error('Error al obtener/insertar la página:', error);
          connection.end();
          return;
        }

        const updateQuery = 'UPDATE pagina SET cantidad_referencias = ? WHERE id = ?';
        const values = [cantidad, idPagina];

        connection.query(updateQuery, values, (error, results, fields) => {
          if (error) {
            console.error('Error al actualizar datos en la tabla "pagina":', error);
          } else {
            //console.log('Datos actualizados con éxito en la tabla "pagina".');
          }

          actualizacionesCompletadas++;
          if (actualizacionesCompletadas === datosOrganizados.length) {
            connection.end();
          }
        });
      });
    });
  });
});

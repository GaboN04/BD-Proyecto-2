const mysql = require('mysql');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',     
  user: 'root',
  password: 'mariadb',   // Contraseña del usuario
  database: 'test' // Nombre de la base de datos predeterminada en MariaDB
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
  
  // Ejemplo de inserción de datos
  const nuevoUsuario = {
    nombre: 'John Doe',
    edad: 30,
    correo: 'john.doe@example.com'
  };

  // Sentencia SQL de inserción
  const sql = 'INSERT INTO usuarios SET ?';

  // Ejecutar la consulta de inserción
  connection.query(sql, nuevoUsuario, (error, results, fields) => {
    if (error) {
      console.error('Error al insertar datos:', error);
    } else {
      console.log('Datos insertados con éxito. ID del nuevo usuario:', results.insertId);
    }
  
    // Cerrar la conexión después de realizar las consultas necesarias
    connection.end();
  });
});



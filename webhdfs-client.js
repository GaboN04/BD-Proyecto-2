var WebHDFS = require('webhdfs');

var hdfs = WebHDFS.createClient({
  user: 'gabriel', // Hadoop user
  host: 'localhost', // Namenode host
  port: 9870 // Namenode port
});

// Ruta en HDFS donde deseas escribir el archivo
var remoteDirectory = '/';
var remoteFilePath = remoteDirectory + 'datos.json';

// Contenido que deseas escribir en el archivo
var content = 'Hello, Hadoop!';

// Crear el directorio si no existe
hdfs.mkdir(remoteDirectory, function(err) {
  if (err && err.statusCode !== 400) {
    console.error('Error al crear el directorio en HDFS:', err);
  } else {
    // Escribir el contenido en el archivo en HDFS
    hdfs.writeFile(remoteFilePath, content, function(err) {
      if (err) {
        console.error('Error al escribir en HDFS:', err);
      } else {
        console.log('Archivo escrito exitosamente en HDFS');
      }
    });
  }
});


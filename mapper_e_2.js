#!/usr/bin/node

let jsonData = '';
process.stdin.on('data', function(chunk) {
  if (chunk !== null) {
    jsonData += chunk;
  }
  // Verificar si el chunk contiene un carácter de nueva línea
  
});

process.stdin.on('end', function() {
  processData();
});

function processData() {
  try {
    if (jsonData !== '') {
      const lines = jsonData.split('\n');
      lines.forEach(line => {
        const data = JSON.parse(line);
        data.images.forEach(function(image) {
            console.log(data.title.text + '\t' + image.alt);
        });
      });
    }
  } catch (parseError) {
    //console.error(`Error parsing JSON: ${parseError}`);
  } finally {
    // Limpiar jsonData después de procesar
    jsonData = '';
  }
}
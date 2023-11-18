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
        var mainParagraph = data.title.mainParagraphs.text.toString().replace(/[0-9]/g, '');
        const paragraphWords = mainParagraph.match(/\b(\w+)\b/g);
        paragraphWords.forEach(function(word) {
            console.log(word.toLowerCase() + '\t' + data.title.text);    
        })
        data.headlines.forEach(function(headline) {
            var headlineParagraph = headline.paragraphs.toString().replace(/[0-9]/g, '');
            const headlineWords = headlineParagraph.match(/\b(\w+)\b/g);
            headlineWords.forEach(function(word) {
                console.log(word.toLowerCase() + '\t' + data.title.text);    
            })
        });
        data.images.forEach(function(image) {
            if(image.alt!=""){
                var imageAlt = image.alt.toString().replace(/[0-9]/g, '');
                const imageAltWords = imageAlt.match(/\b(\w+)\b/g);
                imageAltWords.forEach(function(word) {
                    console.log(word.toLowerCase() + '\t' + data.title.text);    
                })
            }
        });
      });
    }
  } catch (parseError) {
    console.error(`Error parsing JSON: ${parseError}`);
  } finally {
    // Limpiar jsonData después de procesar
    jsonData = '';
  }
}
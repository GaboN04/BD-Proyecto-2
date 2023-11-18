#!/usr/bin/node

process.stdin.setEncoding('utf8');
let currentPage = null;
let titleCount = 0;

let jsonData = '';
process.stdin.on('data', function(chunk) {
  if (chunk !== null) {
    jsonData += chunk;
  }
});

process.stdin.on('end', function() {
    var lines = jsonData.split('\n');
    lines.forEach(function (line, index){
        if (index === 0) {
          const [page, title] = line.split('\t');
          currentPage = page;
          titleCount = 1;
        } else {
          const [page, title] = line.split('\t');
          if (currentPage !== page) {
            console.log(currentPage + '\t' + titleCount);
            currentPage = page;
            titleCount = 1;
          } else {
            titleCount++;
          }
        }
    });

    // Imprimir el último conteo
    if (currentPage !== null) {
      //console.log(currentPage + '\t' + titleCount);
    }
});

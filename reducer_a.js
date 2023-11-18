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
    //console.log(jsonData);
    lines.forEach(function (line){
        
        const [page, title] = line.split('\t');
        //console.log(`Leyendo datos para la clave: ${page}`);
        if (titleCount < 2) {
          currentPage = page;
        }
        if (currentPage !== page) {
          console.log(currentPage+'\t'+ titleCount);
          currentPage = page;
          titleCount = 1;
        } else {
          titleCount++;
        }
    })


});


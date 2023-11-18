#!/usr/bin/node

process.stdin.setEncoding('utf8');

let jsonData = '';
process.stdin.on('data', function(chunk) {
  if (chunk !== null) {
    jsonData += chunk;
  }
});

process.stdin.on('end', function() {
    var lines = jsonData.split('\n');
    lines.forEach(function (line){
        const [page, alt] = line.split('\t');
        if (alt !== "") {
          console.log(page+'\t'+ alt);
        }
    })
});
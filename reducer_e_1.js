#!/usr/bin/node

process.stdin.setEncoding('utf8');
let currentPage = null;
let altCount = 0;

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
        if (currentPage !== page) {
          console.log(currentPage+'\t'+ altCount);
          currentPage = page;
          altCount = 0;
          if(alt!=""){
            altCount++;
          }
        } 
        else {
            currentPage = page;
            if(alt!=""){
                altCount++;
            }
        }
    })
});
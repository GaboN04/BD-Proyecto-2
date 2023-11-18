#!/usr/bin/node

const fs = require('fs');

process.stdin.setEncoding('utf8');

//const natural = require('natural');
//const stemmerp = natural.PorterStemmer;

//const Snowball = require('snowball');
//const stemmers = new Snowball('English');

let jsonData = '';


function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

process.stdin.on('data', function(chunk) {
  if (chunk !== null) {
    jsonData += chunk;
  }
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
        
        const title = data.title;
          
          if (data.references) {
            data.references.forEach(function(reference) {
              if (reference.link) {
                console.log(title.text + '\t' + 1);
              }
            });
          }
          
      });
      
      
    }
    //
      
  } catch (error) {
    console.error('Error parsing JSON:', error.message);
  }
}

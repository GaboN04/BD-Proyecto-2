#!/usr/bin/node

const fs = require('fs');

process.stdin.setEncoding('utf8');

//const natural = require('natural');
//const stemmerp = natural.PorterStemmer;

//const Snowball = require('snowball');
//const stemmers = new Snowball('English');

let jsonData = '';
//const wordCounts = {};

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

function processData(wordCounts = {}) {
  try {
    if (jsonData !== '') {
      
      const lines = jsonData.split('\n');
      lines.forEach(line => {
        const data = JSON.parse(line);
        
          const title = data.title;
          if (title.text) {
            let words = title.text.replace(/[^a-zA-Z ]/g, '').split(/\s+/);
            
            words.forEach(function(word) {
              if (word != "Wikipedia") {
                const stemmedWord = word.toLowerCase();
                const key = `${title.text}\t${stemmedWord}`;
                wordCounts[key] = (wordCounts[key] || 0) + 1;
              }
            });
            
          }
          
          if (data.headlines) {
            data.headlines.forEach(function(headline) {
              if (headline.title) {
                let words = headline.title.replace(/[^a-zA-Z ]/g, '').split(/\s+/);
                for (const word of words) {
                  if (word != "Wikipedia") {
                    
                    const stemmedWord = word.toLowerCase();
                    const key = `${title.text}\t${stemmedWord}`;
                    wordCounts[key] = (wordCounts[key] || 0) + 1;
                  }
                }
              }
            });
          }
          //console.log(jsonData);
          if (data.title.mainParagraphs) {
            const parrafs = data.title.mainParagraphs;
          
            parrafs.text.forEach(function(parraf) {
              if (parraf) {
                words = parraf.replace(/[^a-zA-Z ]/g, '').split(/\s+/);
                
                for (const word of words) {  
                  //console.log(word);
                  //word = replaceAll('\t', ' ', word);
                  //word = replaceAll('\n', ' ', word);
                  if (word != "Wikipedia") {
                    
                    const stemmedWord = word.toLowerCase();
                    const key = `${title.text}\t${stemmedWord}`;
                    wordCounts[key] = (wordCounts[key] || 0) + 1;
                    
                  }
                }
              }
            });
          }
          for (var key in wordCounts) {
            if (wordCounts.hasOwnProperty(key)) {
              console.log(key);
            }
          }
          wordCounts={};
      });
      
      
    }
    //
      
  } catch (error) {
    console.error('Error parsing JSON:', error.message);
  }
}

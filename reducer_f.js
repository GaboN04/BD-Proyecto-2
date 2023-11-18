#!/usr/bin/node

process.stdin.setEncoding('utf8');
let currentWord = null;
let wordCount = 0;

let jsonData = '';

function inTitle(word,title){
    try{
        const wordsTitle = title.split(" ");
        return wordsTitle.includes(word);
    }
    catch(error){
        return false;
    }
}

process.stdin.on('data', function(chunk) {
  if (chunk !== null) {
    jsonData += chunk;
  }
});

process.stdin.on('end', function() {
    var lines = jsonData.split('\n');
    lines.forEach(function (line){
        const [word, title] = line.split('\t');
        if (currentWord !== word) {
            console.log(currentWord+'\t'+ wordCount +'\t'+ inTitle(currentWord,title)+'\t'+ title);
            currentWord = word;
            wordCount = 1;
        } 
        else {
            wordCount++;
        }
    })
});
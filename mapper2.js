#!/usr/bin/node
const fs = require('fs');

process.stdin.setEncoding('utf8');

/* http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript */
function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

/* Read the contents of datos.json */
fs.readFile('datos.json', 'utf8', function (err, data) {
  if (err) {
    console.error('Error reading datos.json:', err);
    process.exit(1);
  }

  try {
    // Parse JSON
    console.log(data);
    //jsonData = replaceAll('/[^a-zA-Z]/g', ''); // Note: You might want to reconsider this line
    const jsonData = JSON.parse(data);

    // Process the JSON data
    let titleCount = 0;

    for (const item of jsonData) {
      if (item.hasOwnProperty('title')) {
        titleCount++;
      }
    }

    console.log('Number of titles:', titleCount);

  } catch (error) {
    console.error('Error parsing JSON:', error.message);
    process.exit(1);
  }
});
#!/usr/bin/node

process.stdin.setEncoding('utf8');

let jsonData = '';
let wordCounts = [];

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
        if (title.text) {
          let words = title.text.replace(/[^a-zA-Z ]/g, '').split(/\s+/);

          words.forEach(function(word) {
            if (word != "Wikipedia") {
              const stemmedWord = word.toLowerCase();
              const key = `${title.text}\t${stemmedWord}\t${title.tag}`;
              wordCounts.push({ key, count: (wordCounts[key] || 0) + 1 });
            }
          });
        }
        if (data.title.mainParagraphs) {
          const parrafs = data.title.mainParagraphs;
          parrafs.text.forEach(function(parraf) {
            if (parraf) {
              words = parraf.replace(/[^a-zA-Z ]/g, '').split(/\s+/);

              for (const word of words) {
                if (word != "Wikipedia") {
                  const stemmedWord = word.toLowerCase();
                  const key = `${title.text}\t${stemmedWord}\t${parrafs.tag}`;
                  wordCounts.push({ key, count: (wordCounts[key] || 0) + 1 });
                }
              }
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
                  const key = `${title.text}\t${stemmedWord}\t${headline.tag}`;
                  wordCounts.push({ key, count: (wordCounts[key] || 0) + 1 });
                }
              }
              
            }
            if (headline.paragraphs) {
              //console.log("holaaaaaaaa")
              headline.paragraphs.text.forEach(function(parraf) {
                let words = parraf.replace(/[^a-zA-Z ]/g, '').split(/\s+/);
                for (const word of words) {
                  if (word != "Wikipedia") {
                    const stemmedWord = word.toLowerCase();
                    const key = `${title.text}\t${stemmedWord}\t${headline.paragraphs.tag}`;
                    wordCounts.push({ key, count: (wordCounts[key] || 0) + 1 });
                  }
                }
              });
            }
          });
        }
        if (data.images) {
          //console.log("holaaa");
          data.images.forEach(function(image) {
            if (image.alt) {
              let words = image.alt.replace(/[^a-zA-Z ]/g, '').split(/\s+/);
              for (const word of words) {
                if (word != "Wikipedia") {
                  const stemmedWord = word.toLowerCase();
                  const key = `${title.text}\t${stemmedWord}`;
                  const tag = `${image.tag}`;
                  wordCounts.push({ key, tag, count: (wordCounts[key] || 0) + 1 });
                }
              }
              
            }
          });
        }

        
      });

      // Ordenar el array por página y luego por palabra
      wordCounts.sort((a, b, c) => {
        const pageComparison = a.key.split('\t')[0].localeCompare(c.key.split('\t')[0]);
        return pageComparison !== 0 ? pageComparison : a.key.localeCompare(c.key);
      });

      // Imprimir el resultado
      wordCounts.forEach(entry => {
        console.log(`${entry.key}\t${entry.count}`);
      });
    }
  } catch (error) {
    console.error('Error parsing JSON:', error.message);
  }
}

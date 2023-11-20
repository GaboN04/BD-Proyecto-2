var express = require('express');
const fs = require('fs');

var WebHDFS = require('webhdfs');

var hdfs = WebHDFS.createClient({
  user: 'gabriel', // Hadoop user
  host: 'localhost', // Namenode host
  port: 9870 // Namenode port
});



// Contenido que deseas escribir en el archivo
var content = 'Hello, Hadoop!';

var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {
  console.log('Example app listening on port http://localhost:3000/');
});

const MAX_PAGES = 20;

const unirest = require('unirest');
const cheerio = require('cheerio');


// TAGS
/*
Titulo: Header
Subtitulo: h2
Imagenes: figure
parrafos: p
referencias: cite
*/
let n=0;
async function wikipediaCrawler(url, results = []) {
  if (n < MAX_PAGES) {
    n++;
  
  try {
    const data = await unirest.get(url).header("Accept", "text/html");
    const dataObject = cheerio.load(data.body);
    const pageTitle = dataObject("title").text();


    const pageContent = {
      title: {text: pageTitle, tag: "header", mainParagraphs: {text: [], tag: "p"}},
      headlines: [],
      images: [],
      references: [],
    };

    let currentHeadline = null;

    dataObject('.mw-headline, p').each(function (i, elem) {
      if (dataObject(elem).hasClass('mw-headline')) {
        const headlineTitle = dataObject(elem).text();
        currentHeadline = {
          title: headlineTitle,
          tag: "h2",
          paragraphs: {text: [], tag: "p"}
        };
        pageContent.headlines.push(currentHeadline);
      } else {
        const paragraphText = dataObject(elem).text();
        if (currentHeadline) {
          currentHeadline.paragraphs.text.push(paragraphText);
        }
        else{
          pageContent.title.mainParagraphs.text.push(paragraphText);
        }
      }
    });

    dataObject('.reference-text').each(function (i, elem) {
        const linkText = dataObject(elem).find("cite").find("a").attr('href');
        const descriptionRef = dataObject(elem).find("cite").find("a").text();
        let authorRef = '';

    // Iterar sobre los nodos hijos de <cite>
        dataObject(elem).find("cite").contents().each(function (_, content) {
            if (content.type === 'text') {
                // Agregar solo el texto directo a authorRef
                authorRef += dataObject(content).text();
            } else if (content.type === 'tag' && content.name === 'a') {
                // Detener la iteración si se encuentra un tag <a>
                return false;
            }
        });
      //const altText = elem.getAttribute('alt');
        currentRef = {
          author: authorRef,
          link: linkText,
          description: descriptionRef,
          tag: "cite",
        };
        pageContent.references.push(currentRef);
    });

    dataObject('.mw-default-size').each(function (i, elem) {
      const linkText = dataObject(elem).find("img").attr('src');
      const figcaptionText = dataObject(elem).find('figcaption').text();
    //const altText = elem.getAttribute('alt');
      currentImage = {
        link: linkText,
        tag: "figure",
        alt: figcaptionText
      };
      pageContent.images.push(currentImage);
    });


    results.push(pageContent);

    const wikiLinks = [];
    dataObject('p a[href^="/wiki/"]').each(function (i, elem) {
      const link = dataObject(elem).attr('href');
      wikiLinks.push(link);
    });

    for (const link of wikiLinks) {
        const fullLink = `https://en.wikipedia.org${[link]}`;
        results = await wikipediaCrawler(fullLink, results);
      }
      return results;
  } catch (error) {
    console.error(`Error processing ${url}: ${error.message}`);
  }
  }
  else {
    return results;
  }
}



  async function wikipediaCrawlerAux(url, n, results) {
    
    try {
      const data = await unirest.get(url).header("Accept", "text/html");
    const dataObject = cheerio.load(data.body);
    const pageTitle = dataObject("title").text();


    const pageContent = {
      title: {text: pageTitle, tag: "header", mainParagraphs: {text: [], tag: "p"}},
      headlines: [],
      images: [],
      references: [],
    };

    let currentHeadline = null;

    dataObject('.mw-headline, p').each(function (i, elem) {
      if (dataObject(elem).hasClass('mw-headline')) {
        const headlineTitle = dataObject(elem).text();
        currentHeadline = {
          title: headlineTitle,
          tag: "h2",
          paragraphs: {text: [], tag: "p"}
        };
        pageContent.headlines.push(currentHeadline);
      } else {
        const paragraphText = dataObject(elem).text();
        if (currentHeadline) {
          currentHeadline.paragraphs.text.push(paragraphText);
        }
        else{
          pageContent.title.mainParagraphs.text.push(paragraphText);
        }
      }
    });

    dataObject('.reference-text').each(function (i, elem) {
        const linkText = dataObject(elem).find("cite").find("a").attr('href');
        const descriptionRef = dataObject(elem).find("cite").find("a").text();
        let authorRef = '';

    // Iterar sobre los nodos hijos de <cite>
        dataObject(elem).find("cite").contents().each(function (_, content) {
            if (content.type === 'text') {
                // Agregar solo el texto directo a authorRef
                authorRef += dataObject(content).text();
            } else if (content.type === 'tag' && content.name === 'a') {
                // Detener la iteración si se encuentra un tag <a>
                return false;
            }
        });
      //const altText = elem.getAttribute('alt');
        currentImage = {
          author: authorRef,
          link: linkText,
          description: descriptionRef,
          tag: "cite",
        };
        pageContent.images.push(currentImage);
    });

    dataObject('.mw-default-size').each(function (i, elem) {
      const linkText = dataObject(elem).find("img").attr('src');
      const figcaptionText = dataObject(elem).find('figcaption').text();
    //const altText = elem.getAttribute('alt');
      currentImage = {
        link: linkText,
        tag: "figure",
        alt: figcaptionText
      };
      pageContent.images.push(currentImage);
    });


    results.push(pageContent);
      
    } catch (error) {
      console.error(`Error processing ${url}: ${error.message}`);
    }
    return results;
  }
  
  // Llamada inicial con un artículo de Wikipedia aleatorio
  async function main() {
    try {
      const results = await wikipediaCrawler("https://en.wikipedia.org/wiki/Basketball");
      const jsonData = JSON.stringify(results, null, 2);

      fs.writeFile('datos.json', jsonData, 'utf8', (err) => {
        if (err) {
          console.error('Error al escribir el archivo:', err);
        } else {
          console.log('Archivo JSON creado exitosamente.');
        }
      });



      //console.log("Finished Crawling");
      //console.log(results);
    } catch (error) {
      console.error("Error during crawling:", error);
    }
  }
  

var remoteDirectory = '/';
var remoteFilePath = remoteDirectory + 'datos.json';
  // Crear el directorio si no existe
hdfs.mkdir(remoteDirectory, async function(err) {
  if (err && err.statusCode !== 400) {
    console.error('Error al crear el directorio en HDFS:', err);
  } else {
    // Escribir el contenido en el archivo en HDFS
    const results = await wikipediaCrawler("https://en.wikipedia.org/wiki/Basketball");
    const jsonData = JSON.stringify(results, null, 2);
    fs.writeFile('datos.json', jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Error al escribir el archivo:', err);
      } else {
        console.log('Archivo JSON creado exitosamente.');
      }
    });
    hdfs.writeFile(remoteFilePath, jsonData, function(err) {
      if (err) {
        console.error('Error al escribir en HDFS:', err);
      } else {
        console.log('Archivo escrito exitosamente en HDFS');
      }
    });
  }
});
var express = require('express');
const fs = require('fs');

var WebHDFS = require('webhdfs');

var hdfs = WebHDFS.createClient({
  user: 'gabriel', // Hadoop user
  host: 'localhost', // Namenode host
  port: 9870 // Namenode port
});



// Contenido que deseas escribir en el archivo

const MAX_RECURSIVE = 3;

const unirest = require('unirest');
const cheerio = require('cheerio');

async function wikipediaCrawler(url, results = [], n = 0) {
  if (n < MAX_RECURSIVE) {
    try {
      const data = await unirest.get(url).header("Accept", "text/html");
      const dataObject = cheerio.load(data.body);
      const pageTitle = dataObject("title").text();

      const pageContent = {
        title: { text: pageTitle, tag: "header", mainParagraphs: { text: [], tag: "p" } },
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
            paragraphs: { text: [], tag: "p" }
          };
          pageContent.headlines.push(currentHeadline);
        } else {
          const paragraphText = dataObject(elem).text();
          if (currentHeadline) {
            currentHeadline.paragraphs.text.push(paragraphText);
          } else {
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

        currentRef = {
          author: authorRef,
          link: linkText,
          description: descriptionRef,
          tag: "cite",
        };
        pageContent.references.push(currentRef);
      });

      // Buscar imágenes solo dentro del contenedor del artículo
      dataObject('.mw-file-description').each(function (i, elem) {
        const linkText = dataObject(elem).find('img').attr('src');
        if (dataObject(elem).find('img').attr('alt')) {
          const altText = dataObject(elem).find('img').attr('alt');
          currentImage = {
            link: linkText,
            tag: "img",
            alt: altText
          };
          pageContent.images.push(currentImage);
        } else {
          currentImage = {
            link: linkText,
            tag: "img",
            alt: ""
          };
          pageContent.images.push(currentImage);
        }
      });

      results.push(pageContent);

      const wikiLinks = [];
      dataObject('p a[href^="/wiki/"]').each(function (i, elem) {
        const link = dataObject(elem).attr('href');
        wikiLinks.push(link);
      });
      //var i = 0;
      if(n+1 < MAX_RECURSIVE) {
        for (const link of wikiLinks) {
          //i++;
          //console.log(i);
          const fullLink = `https://en.wikipedia.org${[link]}`;
          results = await wikipediaCrawler(fullLink, results, n + 1);
        }
      }
      

      
      return results;
    } catch (error) {
      console.error(`Error processing ${url}: ${error.message}`);
      //return results;
    }
  } else {
    return results;
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
      
      // Convertir cada objeto JSON a una línea separada
      const jsonLines = results.map(obj => JSON.stringify(obj));
  
      // Unir las líneas con saltos de línea
      const jsonData = jsonLines.join('\n');
  
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
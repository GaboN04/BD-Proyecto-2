var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {
  console.log('Example app listening on port http://localhost:3000/');
});

const MAX_PAGES = 25;

const unirest = require('unirest');
const cheerio = require('cheerio');



async function wikipediaCrawler(url, n = 0, results = []) {
  try {
    const data = await unirest.get(url).header("Accept", "text/html");
    const dataObject = cheerio.load(data.body);
    const pageTitle = dataObject("title").text();

    const pageContent = {
      title: pageTitle,
      mainParagraphs: [],
      headlines: []
    };

    let currentHeadline = null;

    dataObject('.mw-headline, p').each(function (i, elem) {
      if (dataObject(elem).hasClass('mw-headline')) {
        const headlineTitle = dataObject(elem).text();
        currentHeadline = {
          title: headlineTitle,
          paragraphs: []
        };
        pageContent.headlines.push(currentHeadline);
      } else {
        const paragraphText = dataObject(elem).text();
        pageContent.mainParagraphs.push(paragraphText);

        if (currentHeadline) {
          currentHeadline.paragraphs.push(paragraphText);
        }
      }
    });

    results.push(pageContent);

    const wikiLinks = [];
    dataObject('p a[href^="/wiki/"]').each(function (i, elem) {
      const link = dataObject(elem).attr('href');
      wikiLinks.push(link);
    });

    for (const link of wikiLinks) {
      if (n < MAX_PAGES) {
        n++;
        //console.log(link);
        const fullLink = `https://en.wikipedia.org${[link]}`;
        results = await wikipediaCrawlerAux(fullLink, n, results);
      }
      else {
        break;
      }
    }
  } catch (error) {
    console.error(`Error processing ${url}: ${error.message}`);
  }

  return results;
}
  async function wikipediaCrawlerAux(url, n, results) {
    
    try {
      const data = await unirest.get(url).header("Accept", "text/html");
      const dataObject = cheerio.load(data.body);
      const pageTitle = dataObject("title").text();
  
      const pageContent = {
        title: pageTitle,
        mainParagraphs: [],
        headlines: []
      };
  
      let currentHeadline = null;
  
      dataObject('.mw-headline, p').each(function (i, elem) {
        if (dataObject(elem).hasClass('mw-headline')) {
          const headlineTitle = dataObject(elem).text();
          currentHeadline = {
            title: headlineTitle,
            paragraphs: []
          };
          pageContent.headlines.push(currentHeadline);
        } else {
          const paragraphText = dataObject(elem).text();
          pageContent.mainParagraphs.push(paragraphText);
  
          if (currentHeadline) {
            currentHeadline.paragraphs.push(paragraphText);
          }
        }
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
      console.log("Finished Crawling");
      console.log(results);
    } catch (error) {
      console.error("Error during crawling:", error);
    }
  }
  
  // Llama a la función principal
  main();
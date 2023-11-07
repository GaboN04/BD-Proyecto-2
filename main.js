var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {
  console.log('Example app listening on port http://localhost:3000/');
});

const N = 2;
const unirest = require('unirest');
const cheerio = require('cheerio');

async function wikipediaCrawler(n=0){

    if(n<5){
        const data = await unirest
            .get("https://en.wikipedia.org/wiki/Special:Random")
            .header("Accept", "text/html");

        const dataObject = cheerio.load(data.body);

        // Usar el selector de Cheerio para obtener el título
        const pageTitle = dataObject("title").text();

        console.log("Título de Wikipedia:", pageTitle);

        dataObject('.mw-headline').each(function(i, elem) {
            console.log(dataObject(elem).text());
            //console.log(dataObject(elem).nextUntil('h2').text().trim());
        });
        dataObject('p').each(function(i, elem) {
            console.log(dataObject(elem).text());
            //console.log(dataObject(elem).nextUntil('p').text().trim());
        });
        wikipediaCrawler(n+1);
    }
    else{
        console.log("Finished Crawling");
        return 0;
    }
   
}
wikipediaCrawler();
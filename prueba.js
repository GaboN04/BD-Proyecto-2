const unirest = require('unirest');
const cheerio = require('cheerio');

const MAX_PAGES = 23;
let n = 0;

async function wikipediaCrawler(url, results = []) {
  if (n < MAX_PAGES) {
    n++;

    try {
      // Tu código de web crawling aquí...
      const data = await unirest.get(url).header("Accept", "text/html");
      const dataObject = cheerio.load(data.body);
      const pageTitle = dataObject("title").text();
      // Obtener enlaces aleatorios
      const randomLinks = getRandomLinks(); // Implementa esta función según tus necesidades
      results.push(pageTitle);
      // Visitar las 10 páginas aleatorias de forma recursiva
      for (const link of randomLinks) {
        results = await wikipediaCrawler(link, results);
      }

      return results;
    } catch (error) {
      console.error(`Error processing ${url}: ${error.message}`);
      return results;
    }
  } else {
    return results;
  }
}

// Función para obtener enlaces aleatorios (implementa según tus necesidades)
function getRandomLinks() {
  // Retorna un array de enlaces aleatorios
  // Puedes implementar la lógica para obtener enlaces aleatorios aquí
  // Por ejemplo, puedes parsear la página actual y extraer enlaces aleatorios
  return ['https://en.wikipedia.org/wiki/Special:Random', 'https://en.wikipedia.org/wiki/Special:Random', 'https://en.wikipedia.org/wiki/Special:Random'];
}

// Ejemplo de uso
const startUrl = 'https://en.wikipedia.org/wiki/Special:Random';

async function main() {
  const res =  await wikipediaCrawler(startUrl);
  console.log(res);
}
main();
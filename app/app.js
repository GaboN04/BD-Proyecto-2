const searchedWords = [];

function addWord() {
  const searchInput = document.getElementById('search-input').value;

  if (searchInput.trim() !== '') {
    // Crear un objeto para representar la palabra
    const wordObject = {
      name: searchInput,
      // Puedes agregar más propiedades aquí según tus necesidades
    };

    // Agregar el objeto al array
    searchedWords.push(searchInput);

    // Limpiar el campo de búsqueda
    document.getElementById('search-input').value = '';

    // Actualizar la visualización de las palabras buscadas
    displaySearchedWords();
  }
}

function displaySearchedWords() {
  const searchedWordsContainer = document.getElementById('search-words');
  document.getElementById("data").value = `${searchedWords}`;
  searchedWordsContainer.innerHTML = '';
  let i = 0;
  searchedWords.forEach((word, index) => {
    const wordItem = document.createElement('div');
    wordItem.classList.add('words');
    wordItem.textContent = word; // Mostrar el nombre de la palabra
    wordItem.id =  `word${i}`;
    wordItem.name = `word${i}`;

    const removeButton = document.createElement('span');
    removeButton.classList.add('remove-button');
    removeButton.innerHTML = '&#10006;'; // Usar el carácter 'x'

    // Agregar el evento click para eliminar la palabra
    removeButton.addEventListener('click', () => removeSearchedWord(index));

    wordItem.appendChild(removeButton);
    searchedWordsContainer.appendChild(wordItem);
    i++;
  });
}

function removeSearchedWord(index) {
  searchedWords.splice(index, 1);
  displaySearchedWords();
}


/*
const searchedWords = [];

function addWord() {
  const searchInput = document.getElementById('search-input').value;

  if (searchInput.trim() !== '') {
    searchedWords.push(searchInput);
    document.getElementById('search-input').value = '';
    displaySearchedWords();
  }
}

function displaySearchedWords() {
  const searchedWordsContainer = document.getElementById('searched-words');
  searchedWordsContainer.innerHTML = '';

  searchedWords.forEach((word, index) => {
    const wordItem = document.createElement('div');
    wordItem.classList.add('searched-word');
    wordItem.textContent = word;

    const removeButton = document.createElement('span');
    removeButton.classList.add('remove-button');
    removeButton.innerHTML = '&#10006;'; // Use 'x' character

    // Agrega el evento click para eliminar la palabra
    removeButton.addEventListener('click', () => removeSearchedWord(index));

    wordItem.appendChild(removeButton);
    searchedWordsContainer.appendChild(wordItem);
  });
}

function removeSearchedWord(index) {
  searchedWords.splice(index, 1);
  displaySearchedWords();
}
*/
const datosOrganizados = [
  ['carro', ['Título 1', 99, 10, 5]],
  ['carro', ['Título 2', 55, 8, 3]],
  // ... otros datos
];


/*
const formBusqueda = document.getElementById('formBusqueda');

formBusqueda.addEventListener('submit', () => {

  const searchInput = document.getElementById('search-input');
  const palabrasABuscar = searchInput.value;

  // Realiza una solicitud POST con el valor de 'palabrasABuscar'
    fetch('/buscar')
      .then(response => response.text())
      .then(data => {
        console.log(data);
    })
      .catch(error => {
          console.error('Error fetching data:', error);
    });
  });
*/

document.addEventListener('DOMContentLoaded', () => {
  // Obtener elementos donde se mostrarán las estadísticas
  
  // Realizar una solicitud al servidor para obtener las estadísticas
  fetch('/buscar')
    .then(response => response.json())
    .then(resultados => {
      // Actualizar el contenido de la página con las estadísticas obtenidas
      console.log(resultados);
      const resultsContainer = document.getElementById('results-container');
      resultsContainer.innerHTML = '';
      const pageFrequency = {};

// Recorre el array combinado y actualiza la frecuencia de cada página
      resultados.forEach(page => {
        page.forEach(function(resultado){
          const pageTitle = resultado.titulo;
          if (pageFrequency[pageTitle]) {
            pageFrequency[pageTitle].palabras.push(resultado.palabra);
            pageFrequency[pageTitle].porcentaje_apariciones = pageFrequency[pageTitle].porcentaje_apariciones + resultado.porcentaje_apariciones;
            pageFrequency[pageTitle].porcentaje_titulos = pageFrequency[pageTitle].porcentaje_titulos + resultado.porcentaje_titulos;
            pageFrequency[pageTitle].frecuencia++;
          } else {
            pageFrequency[pageTitle] = {"pageTitle": pageTitle,
                                        "palabras": [resultado.palabra], 
                                        "porcentaje_apariciones": resultado.porcentaje_apariciones,
                                        "porcentaje_titulos": resultado.porcentaje_titulos,
                                      "frecuencia": 1};
          }
        })
        
      });
      //let jsonResultados = {{titulo:}}
      //console.log(pageFrequency);
      // Filtra las páginas que se repiten
      const duplicatedPages = Object.entries(pageFrequency)
      .filter(([page, frequency]) => frequency.frecuencia === resultados.length)
      .reduce((acc, [page, frequency]) => {
        acc[page] = frequency;
        return acc;
      }, {});
      const duplicatedPagesArray = Object.values(duplicatedPages);

      duplicatedPagesArray.sort((a, b) => {
        let productA = 0;
        let productB = 0;
        if (a.porcentaje_titulos == 0) {
          productA = a.porcentaje_apariciones;
        }
        else {
          productA = a.porcentaje_apariciones * a.porcentaje_titulos;
        }
        if (b.porcentaje_titulos == 0) {
          productB = b.porcentaje_apariciones;
        }
        else {
          productB = b.porcentaje_apariciones * b.porcentaje_titulos;
        }
        
        return productB - productA; // Orden descendente, puedes cambiar a productA - productB para orden ascendente
      });
      

      // Muestra las páginas duplicadas en la consola
      console.log("Páginas duplicadas:", duplicatedPagesArray);

      duplicatedPagesArray.forEach(function(page){
        var resultBox = document.createElement('div');
            resultBox.classList.add('result-box');
            resultBox.innerHTML = `
            <p>Palabra: ${page.palabras.toString()}</p>
            <p>Página: ${page.pageTitle}</p>
            <p>Porcentaje de aparaciones en texto: ${page.porcentaje_apariciones}%</p>
            <p>Porcentaje de apareciones en titulos: ${page.porcentaje_titulos}%</p>
            `;
            resultsContainer.appendChild(resultBox);
      })
    })
    .catch(error => console.error('Error al obtener estadísticas del servidor:', error));
});

document.addEventListener('DOMContentLoaded', () => {
  // Obtener elementos donde se mostrarán las estadísticas
  const promedioSubtitulosElement = document.getElementById('promedio-subtitulos');
  const promedioPalabrasElement = document.getElementById('promedio-palabras');
  const promedioReferenciasElement = document.getElementById('promedio-referencias-con-enlaces');
  const promedioImgAltElement = document.getElementById('promedio-img-alt');

  // Realizar una solicitud al servidor para obtener las estadísticas
  fetch('/estadisticas')
    .then(response => response.json())
    .then(estadisticas => {
      // Actualizar el contenido de la página con las estadísticas obtenidas
      promedioSubtitulosElement.textContent = estadisticas.promedioSubtitulos;
      promedioPalabrasElement.textContent = estadisticas.promedioPalabras;
      promedioReferenciasElement.textContent = estadisticas.promedioReferenciasConEnlaces;
      promedioImgAltElement.textContent = estadisticas.promedioImgAlt;
    })
    .catch(error => console.error('Error al obtener estadísticas del servidor:', error));
});

// Event listener para el botón de búsqueda

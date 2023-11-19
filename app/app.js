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

const datosOrganizados = [
  ['carro', ['Título 1', 99, 10, 5]],
  ['carro', ['Título 2', 55, 8, 3]],
  // ... otros datos
];





// Función para buscar y mostrar los resultados
function search() {
  const searchInput = document.getElementById('search-input').value;

  // Realizar una solicitud al servidor para obtener los datos filtrados
  fetch(`/datos?searchInput=${searchInput}`)
    .then(response => response.json())
    .then(resultados => {
      // Limpiar el contenedor de resultados antes de mostrar nuevos resultados
      const resultsContainer = document.getElementById('results-container');
      resultsContainer.innerHTML = '';

      // Mostrar los resultados en el contenedor
      resultados.forEach(resultado => {
        const { palabra, titulo, cantidad, subtitulos, referencias } = resultado;

        // Crear una nueva caja para cada resultado
        const resultBox = document.createElement('div');
        resultBox.classList.add('result-box');

        // Agregar información al contenido de la caja
        resultBox.innerHTML = `
          <p>Palabra: ${palabra}</p>
          <p>Página: ${titulo}</p>
          <p>Cantidad de veces: ${cantidad}</p>
          <p>Cantidad de subtítulos: ${subtitulos}</p>
          <p>Cantidad de referencias: ${referencias}</p>
        `;

        // Agregar la caja al contenedor de resultados
        resultsContainer.appendChild(resultBox);
      });
    })
    .catch(error => console.error('Error al obtener datos del servidor:', error));
}






/*
// Función para buscar y mostrar los resultados
function search() {
  const searchInput = document.getElementById('search-input').value;

  // Filtra los resultados según la búsqueda
  const resultados = datosOrganizados.filter(dato => dato[0].includes(searchInput));

  // Limpiar el contenedor de resultados antes de mostrar nuevos resultados
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = '';

  // Mostrar los resultados en el contenedor
  resultados.forEach(resultado => {
    const [palabra, [titulo, cantidad, subtitulos, referencias]] = resultado;

    // Crear una nueva caja para cada resultado
    const resultBox = document.createElement('div');
    resultBox.classList.add('result-box');

    // Agregar información al contenido de la caja
    resultBox.innerHTML = `
      <p>Página: ${titulo}</p>
      <p>Cantidad de veces: ${cantidad}</p>
      <p>Cantidad de subtítulos: ${subtitulos}</p>
      <p>Cantidad de referencias: ${referencias}</p>
    `;

    // Agregar la caja al contenedor de resultados
    resultsContainer.appendChild(resultBox);
  });
}
*/
// Event listener para el botón de búsqueda
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', search);

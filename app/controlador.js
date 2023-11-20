const mysql = require('mysql');

function initConnection(){
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mariadb',
        database: 'BD'
      });
    return connection;
}

class Controller {
  constructor() {
    this.connection = initConnection();
  }

  conectar() {
    this.connection.connect((err) => {
      if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
      }
      console.log('Conexión a la base de datos establecida');
    });
  }

  desconectar() {
    this.connection.end();
  }

  promedioDeTitulosPorPagina() {
    return new Promise((resolve, reject) => {
      const query = "SELECT AVG(subtitulos) AS promedio FROM pagina";
      this.connection.query(query, (err, result, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0].promedio || 0);
        }
      });
    });
  }
  
   promedioDePalabrasPorPagina(){
    return new Promise((resolve, reject) => {
      this.connection.query("SELECT AVG(cantidad_palabras) AS promedio FROM pagina", function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(result[0].promedio || 0);
        }
      });
    });
    }
     promedioDeReferenciasPorPagina(){
      return new Promise((resolve, reject) => {
        this.connection.query("SELECT AVG(cantidad_referencias) AS promedio FROM pagina", function (err, result, fields) {
          if (err) {
            reject(err);
          } else {
            resolve(result[0].promedio || 0);
          }
        });
      });
    }
     promedioDeAltPorPagina(){
      return new Promise((resolve, reject) => {
      this.connection.query("SELECT AVG(alt) AS promedio FROM pagina", function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(result[0].promedio || 0);
        }
      });
    });
    }
     top3Palabras(){
      let topPalabras = [];
      let cantidadPaginas = 0;
      this.connection.query("SELECT atributo, cantidad FROM pagina ORDER BY cantidad", function (err, result, fields) {
        if (err) throw err;
        topPalabras.push(result[0].atributo);
        topPalabras.push(result[1].atributo);
        topPalabras.push(result[2].atributo);
      });
      return topPalabras
    }
    async getPaginasPalabra(palabra) {
      return new Promise((resolve, reject) => {
        let paginas = [];
        //const query = "";
    
        this.connection.query(`SELECT pagina.titulo, palabra.id_pagina, pagina.id FROM palabra INNER JOIN pagina ON palabra.id_pagina = pagina.id WHERE palabra.atributo = "${palabra}"`, function (err, result, fields) {
          if (err) {
            reject(err);
          } else {
            //console.log(result);
            result.forEach(function (row) {
              paginas.push(row.titulo);
            });
            resolve(paginas);
          }
        });
      });
    }
    async getResultadosPalabra(palabras) {
      return new Promise((resolve, reject) => {
        //const query = "";
        
        this.connection.query(
        `SELECT
          p.id,
          p.titulo,
          w.atributo AS palabra,
          w.cantidad AS apariciones,
          (w.cantidad / p.cantidad_palabras) * 100 AS porcentaje_apariciones, 
          (w.aparece_en_titulo / p.subtitulos )*100 AS porcentaje_titulos
          FROM
          palabra w
          JOIN
          pagina p ON w.id_pagina = p.id WHERE w.atributo="${palabras}";`, function (err, result, fields) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    } 
    
    
    /*
    getPaginasPalabra(palabra){
      return new Promise((resolve, reject) => {
        let paginas = [];
        this.connection.query(`SELECT pagina.titulo, palabra.id_pagina, pagina.id FROM palabra WHERE palabra=${palabra} INNER JOIN pagina ON palabra.id_pagina = pagina.id`, function (err, result, fields) {
          if (err) {
            reject(err);
          } else { 
            console.log(result);
            result.forEach(function (row){
              paginas.push(row.titulo)
            });
            
            resolve(paginas);
          }
        });
      });
    }
    */
    getIdPagina(titulo){
      return new Promise((resolve, reject) => {
        this.connection.query(`SELECT id, titulo, FROM pagina WHERE titulo=${titulo}`, function (err, result, fields) {
          if (err) throw err;
            resolve(result[0].id);
        });
      }); 
    }
    functiongetCantidadPalabraPagina(palabra,pagina){
      return new Promise((resolve, reject) => {
        const idPagina = this.getIdPagina(pagina);
        this.connection.query(`SELECT palabra.cantidad, palabra.id_pagina, pagina.id FROM palabra WHERE atributo=${palabra} INNER JOIN pagina ON palabra.id_pagina = pagina.id`, function (err, result, fields) {
          if (err) throw err;
            return result[0].cantidad;
        });
        return paginas;
      });
    }
    getPorcentajePalabraPorPagina(palabra,pagina){
      return new Promise((resolve, reject) => {
        const total = this.getPalabrasPorPagina(pagina);
        const cantidadPalabra = this.getCantidadPalabraPagina()
         resolve(cantidadPalabra/total);
      });
    }
    
    
}



module.exports = Controller;

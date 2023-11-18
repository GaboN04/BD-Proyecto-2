#!/usr/bin/node

process.stdin.setEncoding('utf8');
var current_word = '';
var current_page = '';
var current_count = 0;
var header_count = 0; // Nuevo contador para el tag "header"

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    chunk = chunk.trim();
    var arr = chunk.split('\n');
    for (var i = 0; i < arr.length; i++) {
      var tuple = arr[i].split('\t');
      var page = tuple[0];
      var word = tuple[1];
      var count = parseInt(tuple[3]);
      var tag = tuple[2];

      if (current_word === word && current_page === page) {
        current_count += count;
        if (tag === "header") { // Tag "header"
          header_count += count;
        }
      } else {
        if (current_word !== '' && current_page !== '') {
          console.log(current_word + '\t' + current_page + '\t' + current_count + '\t' + header_count);
        }
        current_word = word;
        current_page = page;
        current_count = count;
        header_count = tag === "header" ? count : 0;
      }
    }

  }
});

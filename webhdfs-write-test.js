// Include created client
var hdfs = require('./webhdfs-client.js');

// Include fs module for local file system operations
var fs = require('fs');

// Initialize readable stream from local file
// Change this to real path in your file system
var localFileStream = fs.createReadStream('./prueba/pr');

// Initialize writable stream to HDFS target
var remoteFileStream = hdfs.createWriteStream('./prueba/pr2');

// Pipe data to HDFS
localFileStream.pipe(remoteFileStream);

// Handle errors
remoteFileStream.on('error', function onError (err) {
  console.log("errooooooorrrrrrrrr");
});

// Handle finish event
remoteFileStream.on('finish', function onFinish () {
  // Upload is done
});
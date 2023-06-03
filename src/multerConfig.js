const multer = require('multer');

// Create an instance of the multer middleware
const upload = multer({
  dest: 'uploads/', // Specify the destination directory to save the uploaded files
  limits: {
    fileSize: 1048576, // Set the maximum file size (in bytes)
  },
});

module.exports = upload;
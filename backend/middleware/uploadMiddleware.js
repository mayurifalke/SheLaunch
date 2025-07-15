const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
   storage: storage,
   limits:{
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
   }
  });

  // module.exports = upload.single('file'); // 'file' is the field name in the form
  module.exports = upload;
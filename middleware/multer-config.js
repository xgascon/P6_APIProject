const multer = require('multer'); /* multer plugin  */

// Definition of image formats that will be enable for upload
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Definition of file location for saving and filename 
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');/* image will be saved in the folder 'images' */
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');/* replacing the spaces by underscores for naming purposes */
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);/* adding date and the image format to the filename */
  }
});

module.exports = multer({storage: storage}).single('image');
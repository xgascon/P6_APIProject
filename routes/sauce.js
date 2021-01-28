const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');/* import code to manage tokens */
const multer = require('../middleware/multer-config');/* import code to manage images */

const stuffCtrl = require('../controllers/sauce');/* import codes from 'sauce' file */

router.get('/', auth, stuffCtrl.getAllSauce);
router.post('/', auth, multer, stuffCtrl.createSauce);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
router.post('/:id/like', auth, stuffCtrl.likeSauce);

module.exports = router;
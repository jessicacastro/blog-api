var express = require('express');
const postController = require('../controllers/postController');
var router = express.Router();

router.get('/', postController.index);
router.post('/', postController.store);
router.get('/:id', postController.show);
router.put('/:id', postController.update);
router.delete('/:id', postController.delete);

module.exports = router;
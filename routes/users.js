const router = require('express').Router();

const { createUser } = require('../controllers/users');

/* router.get('/', getAllUsers);
router.get('/:userId', getUser); */
router.get('/users', createUser);

module.exports = router;

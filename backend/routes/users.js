const router = require('express').Router();

const {
  getUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUser);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;

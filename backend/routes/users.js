const router = require('express').Router();

const {
  getUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');
const { checkUserId, checkUpdateUser, checkUpdateAvatar } = require('../middleware/validateUsers');

router.get('/users', getUser);
router.get('/users/:userId', checkUserId, getUserById);
router.patch('/users/me', checkUpdateUser, updateUser);
router.patch('/users/me/avatar', checkUpdateAvatar, updateAvatar);

module.exports = router;

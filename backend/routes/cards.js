const router = require('express').Router();

const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  checkCreateCard, checkCardId,
} = require('../middleware/validateCards');

router.get('/cards', getCards);
router.post('/cards', checkCreateCard, createCard);
router.delete('/cards/:cardId', checkCardId, deleteCardById);
router.put('/cards/:cardId/likes', checkCardId, likeCard);
router.delete('/cards/:cardId/likes', checkCardId, dislikeCard);

module.exports = router;

const router = require('express').Router();

const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  checkCreateCard, checkCardId,
} = require('../middleware/validateCards');

router.get('/', getCards);
router.post('/', checkCreateCard, createCard);
router.delete('/:cardId', checkCardId, deleteCardById);
router.put('/:cardId/likes', checkCardId, likeCard);
router.delete('/:cardId/likes', checkCardId, dislikeCard);

module.exports = router;

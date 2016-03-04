const express = require('express');
const shoppingItemMiddleware = require('./middleware').shoppingItem;
const router = express.Router(); // eslint-disable-line

router.get('/', [shoppingItemMiddleware.getShoppingItems]);
router.get('/:id', [shoppingItemMiddleware.getShoppingItem]);
router.get('/:id/cart', [shoppingItemMiddleware.getShoppingItemCart]);
router.post('/', [shoppingItemMiddleware.createShoppingItem]);
router.delete('/:id', [shoppingItemMiddleware.deleteShoppingItem]);
router.put('/:id', [shoppingItemMiddleware.updateShoppingItem]);

module.exports = router;

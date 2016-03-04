const express = require('express');
const shoppingCartMiddleware = require('./middleware').shoppingCart;
const router = express.Router(); // eslint-disable-line

router.get('/', [shoppingCartMiddleware.getShoppingCarts]);
router.get('/:id', [shoppingCartMiddleware.getShoppingCart]);
router.get('/:id/items', [shoppingCartMiddleware.getShoppingCartItems]);
router.post('/', [shoppingCartMiddleware.createShoppingCart]);
router.delete('/:id', [shoppingCartMiddleware.deleteShoppingCart]);
router.put('/:id', [shoppingCartMiddleware.updateShoppingCart]);

module.exports = router;

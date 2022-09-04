const express = require("express");
const {
  requireSignin,
  isUserMiddleware,
} = require("../common-middleware/middleware");
const {
  addItemstoCart,
  getCartItems,
  removeCartItems,
} = require("../controllers/cart");

const router = express.Router();

router.post(
  "/user/cart/add-to-cart",
  requireSignin,
  isUserMiddleware,
  addItemstoCart
);
router.post( 
  "/user/cart/getcartItems", 
  requireSignin,
  isUserMiddleware,
  getCartItems
);
router.post(
  "/user/cart/removeCartItem",
  requireSignin,
  isUserMiddleware,
  removeCartItems
);

// router.get('/category/getcategory',getCategory)

module.exports = router;

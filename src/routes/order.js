const express = require("express");
const {
  requireSignin,
  isUserMiddleware,
} = require("../common-middleware/middleware");
const { addOrder, getOrder, getOrderDetails } = require("../controllers/order");

const router = express.Router();

router.post("/addOrder", requireSignin, isUserMiddleware, addOrder);
router.get("/getOrder", requireSignin, isUserMiddleware, getOrder);
router.post(
  "/getOrderDetails",
  requireSignin,
  isUserMiddleware, 
  getOrderDetails
);

// router.get('/category/getcategory',getCategory)

module.exports = router;

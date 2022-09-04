const express = require("express");
const {
  isAdminMiddleware,
  requireSignin,
} = require("../../common-middleware/middleware");
const { updateOrder, getAllOrders } = require("../../controllers/admin/order");

const router = express.Router();

router.post("/order/update", requireSignin, isAdminMiddleware, updateOrder);
router.get(
  "/order/getAllOrders",
  requireSignin,
  isAdminMiddleware,
  getAllOrders
);

module.exports = router;

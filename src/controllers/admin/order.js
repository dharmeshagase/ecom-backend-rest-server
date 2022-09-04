const Order = require("../../models/order");

exports.updateOrder = (req, res) => {
  //   console.log(req);
  Order.updateOne(
    {
      _id: req.body.orderId,
      "orderStatus.type": req.body.type,
    },
    {
      $set: {
        "orderStatus.$": [
          { type: req.body.type, date: new Date(), isCompleted: true },
        ],
      },
    },
    { new: true }
  ).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) return res.status(200).json({ order });
  });
};
exports.getAllOrders = (req, res) => {
  Order.find({})
    .populate("items.productId", "name")
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) return res.status(200).json({ order });
    });
};

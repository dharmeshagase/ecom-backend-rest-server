const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");
exports.addOrder = (req, res) => {
  Cart.deleteOne({ user: req.user._id }).exec((err, result) => {
    if (err) return res.status(400).json({ err });
    if (result) {
      req.body.user = req.user._id;
      req.body.orderStatus = [
        {
          type: "ordered",
          date: new Date(),
          isCompleted: true,
        },
        {
          type: "packed",
          isCompleted: false,
        },
        {
          type: "shipped",
          isCompleted: false,
        },
        {
          type: "delivered",
          isCompleted: false,
        },
      ];
      //   console.log(req.body);
      const order = new Order(req.body);
      order.save((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) return res.status(200).json({ order });
      });
    }
  });
};

exports.getOrder = (req, res) => {
  Order.find({ user: req.user._id })
    .select("_id paymentStatus items")
    .populate("items.productId", "_id name productPictures")
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) return res.status(200).json({ order });
    });
};

exports.getOrderDetails = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    // .select("_id paymentStatus items")
    .populate("items.productId", "_id name productPictures")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Address.findOne({ user: req.user._id }).exec((err, address) => {
          if (err) return res.status(400).json({ err });
          order.address = address.address.find(
            (adr) => adr._id.toString() == order.addressId.toString()
          );
          res.status(200).json({ order });
        });
      }
    });
};

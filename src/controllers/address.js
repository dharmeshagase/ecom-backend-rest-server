const UserAddress = require("../models/address");

exports.addAddress = (req, res) => {
  const { address } = req.body;
  // console.log(address);
  // console.log("44444444444444444444444444444444444");
  if (address) {
    if (address._id) {
      UserAddress.findOneAndUpdate(
        {
          user: req.user._id,
          "address._id": address._id,
        },
        {
          $set: {
            "address.$": address,
          },
        }
      ).exec((error, address) => {
        // console.log("Into exec");
        if (error) return res.status(400).json({ error });
        if (address) {
          // console.log(address);
          return res.status(200).json({ address });
        }
      });
    } else {
      UserAddress.findOneAndUpdate(
        { user: req.user._id },
        {
          $push: {
            address: address,
          },
        },
        { upsert: true, new: true }
      ).exec((error, address) => {
        if (error) return res.status(400).json({ error });
        if (address) return res.status(200).json({ address });
      });
    }
  } else {
    res.status(400).json({ error: "Params address required" });
  }
};

exports.getAddress = (req, res) => {
  UserAddress.find({ user: req.user._id }).exec((error, address) => {
    // console.log(address[0].address);
    if (error) return res.status(400).json({ error });
    if (address) return res.status(200).json({ address });
  });
};

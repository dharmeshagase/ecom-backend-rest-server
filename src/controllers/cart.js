const { response } = require("express");
const Cart = require("../models/cart");

function runUpdate(condition, action) {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(condition, action, { new: true, upsert: true })
      .then((result) => resolve())
      .catch((error) => reject(error));
  });
}
exports.getCartItems = (req, res) => {
  // console.log(req.user._id);
  Cart.findOne({ user: req.user._id })
    .populate("cartItems.product", "_id name price productPictures")
    .exec((error, cart) => {
      if (error) res.status(400).json({ error });
      if (cart) {
        let cartItems = {};
        // console.log(cart);
        cart.cartItems.forEach((item, index) => {
          cartItems[item.product._id.toString()] = {
            _id: item.product._id.toString(),
            name: item.product.name,
            price: item.product.price,
            img: item.product.productPictures[0].img,
            qty: item.quantity,
          };
        });
        return res.status(200).json({ cartItems });
      }
    });
};
exports.addItemstoCart = (req, res) => {
  // return res.status(200).json({msg:"Yolo"});
  const user = req.user._id;
  // console.log(user);
  let condition, action;
  Cart.findOne({ user }).exec((error, cart) => {
    if (error) return res.status(400).json({ error });
    if (cart) {
      let promiseArray = [];
      req.body.cartItems.forEach((cartItem) => {
        const product = cartItem.product;
        const isItemAdded = cart.cartItems.find(
          (item) => item.product == product
        );
        if (isItemAdded) {
          //If the cart and the product already exists then just update the quantity
          condition = { user, "cartItems.product": product };
          action = {
            $set: {
              "cartItems.$": cartItem,
            },
          };
        } else {
          //If the cart already exists but not the product then add the new product
          condition = { user };
          action = {
            $push: {
              cartItems: cartItem,
            },
          };
        }
        promiseArray.push(runUpdate(condition, action));
        // Cart.findOneAndUpdate(condition, action, { new: true }).exec((error, cart) => {
        //     if (error)
        //         return res.status(400).json({ error });
        //     if (cart)
        //         return res.status(200).json({ cart });
        // });
      });
      Promise.all(promiseArray)
        .then((response) => res.status(201).json({ response }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      //If the cart doesn't exist then create a new one
      const cart = new Cart({
        user: user,
        cartItems: req.body.cartItems,
      });
      cart.save((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart)
          return res.status(200).json({ message: "Cart created successfully" });
      });
    }
  });
};
exports.removeCartItems = (req, res) => {
  const { productId } = req.body;
  Cart.updateOne(
    { user: req.user._id },
    {
      $pull: {
        "cartItems": { "product": productId } ,
      }, 
    },
    {
      multi: true,
    }
  ).exec((error, result) => {
    if (error) res.status(400).json({ error });
    if (result) {
      res.status(202).json({ result });
    }
  });
};
// exports.addItemstoCart = (req, res) => {
//     // return res.status(200).json({msg:"Yolo"});
//     const user = req.user._id;
//     // console.log(user);
//     let condition, action;
//     Cart.findOne({ user }).exec((error, cart) => {
//         if (error)
//             return res.status(400).json({ error })
//         const product = req.body.cartItems.product;
//         if (cart) {
//             const isItemAdded = cart.cartItems.find(cartItem => cartItem.product == product);
//             if (isItemAdded) {
//                 //If the cart and the product already exists then just update the quantity
//                 condition = { user, "cartItems.product": product };
//                 action = {
//                     "$set":
//                     {
//                         "cartItems.$": {
//                             ...req.body.cartItems,
//                             quantity: isItemAdded.quantity + req.body.cartItems.quantity,
//                         }
//                     }
//                 };
//             }
//             else {
//                 //If the cart already exists but not the product then add the new product
//                 condition = { user };
//                 action = {
//                     "$push": {
//                         "cartItems": req.body.cartItems,
//                     }
//                 };
//             }
//             Cart.findOneAndUpdate(condition, action, { new: true }).exec((error, cart) => {
//                 if (error)
//                     return res.status(400).json({ error });
//                 if (cart)
//                     return res.status(200).json({ cart });
//             });
//         }
//         else {
//             //If the cart doesn't exist then create a new one
//             const cart = new Cart({
//                 user: user,
//                 cartItems: [req.body.cartItems]
//             })
//             cart.save((error, cart) => {
//                 if (error)
//                     return res.status(400).json({ error });
//                 if (cart)
//                     return res.status(200).json({ message: "Cart created successfully" });
//             })
//         }

//     });
// }

// exports.addItemToCart = (req, res) => {
//     Cart.findOne({ user: req.user._id }).exec((error, cart) => {
//       if (error) return res.status(400).json({ error });
//       if (cart) {
//         //if cart already exists then update cart by quantity
//         let promiseArray = [];

//         req.body.cartItems.forEach((cartItem) => {
//           const product = cartItem.product;
//           const item = cart.cartItems.find((c) => c.product == product);
//           let condition, update;
//           if (item) {
//             condition = { user: req.user._id, "cartItems.product": product };
//             update = {
//               $set: {
//                 "cartItems.$": cartItem,
//               },
//             };
//           } else {
//             condition = { user: req.user._id };
//             update = {
//               $push: {
//                 cartItems: cartItem,
//               },
//             };
//           }
//           promiseArray.push(runUpdate(condition, update));
//           //Cart.findOneAndUpdate(condition, update, { new: true }).exec();
//           // .exec((error, _cart) => {
//           //     if(error) return res.status(400).json({ error });
//           //     if(_cart){
//           //         //return res.status(201).json({ cart: _cart });
//           //         updateCount++;
//           //     }
//           // })
//         });
//         Promise.all(promiseArray)
//           .then((response) => res.status(201).json({ response }))
//           .catch((error) => res.status(400).json({ error }));
//       } else {
//         //if cart not exist then create a new cart
//         const cart = new Cart({
//           user: req.user._id,
//           cartItems: req.body.cartItems,
//         });
//         cart.save((error, cart) => {
//           if (error) return res.status(400).json({ error });
//           if (cart) {
//             return res.status(201).json({ cart });
//           }
//         });
//       }
//     });
//   };

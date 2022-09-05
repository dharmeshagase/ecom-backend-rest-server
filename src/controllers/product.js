const slugify = require("slugify");
const Product = require("../models/product");
const Category = require("../models/category");
exports.addProduct = (req, res) => {
  const { name, description, price, category, quantity } = req.body;
  let productPictures = [];
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.location };
    });
  }
  const newProduct = new Product({
    name,
    description,
    price,
    quantity,
    category,
    productPictures,
    slug: slugify(name),
    createdBy: req.user._id,
  });
  newProduct.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (category)
      return res.status(200).json({ message: "Product created successfully" ,files:req.files});
  });
};

exports.getProducts = (req, res) => {
  Product.find({}).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    // console.log(categories)
    if (product) return res.status(200).json({ product });
  });
};
exports.getProductsBySlug = (req, res) => {
  // console.log(req);
  const { slug } = req.params;
  // console.log(req.params);
  Category.findOne({ slug })
    .select("_id name type")
    .exec((error, category) => {
      if (error) return res.status(400).json({ error });
      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }
          if (category.type) {
            if (products.length > 0) {
              res.status(200).json({
                products,
                priceRange: {
                  under5k: "5000",
                  under10k: "10000",
                  under15k: "15000",
                  under20k: "20000",
                  under30k: "30000",
                  under50k: "50000",
                },
                productByPrice: {
                  under5k: products.filter((product) => product.price <= 5000),
                  under10k: products.filter(
                    (product) => product.price > 5000 && product.price <= 10000
                  ),
                  under15k: products.filter(
                    (product) => product.price > 10000 && product.price <= 15000
                  ),
                  under20k: products.filter(
                    (product) => product.price > 15000 && product.price <= 20000
                  ),
                  under30k: products.filter(
                    (product) => product.price > 20000 && product.price <= 30000
                  ),
                  under50k: products.filter(
                    (product) => product.price > 30000 && product.price <= 50000
                  ),
                },
              });
            }
          } else {
            res.status(200).json({ products });
          }
        });
      }
    });
};

exports.deleteProductById = (req,res)=>{
  // console.log(req);
  const  {productId}  = req.body;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      // console.log(product);
      if (error) return res.status(400).json({ error });
      // console.log(categories)
      if (result) return res.status(200).json({ result });
    });
  } else return res.status(400).json({ error: "Params required" });
}

exports.getProductDetails = (req, res) => {
  // console.log(req.params);
  const { productId } = req.params;
  if (productId) {
    Product.find({ _id: productId }).exec((error, product) => {
      // console.log(product);
      if (error) return res.status(400).json({ error });
      // console.log(categories)
      if (product) return res.status(200).json({ productDetails: product[0] });
    });
  } else return res.status(400).json({ error: "Params required" });
};

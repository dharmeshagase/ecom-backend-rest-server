const Category = require("../../models/category");
const Product = require("../../models/product");
const Order = require("../../models/order");
function createSubCategory(categories, parentId = null) {
  const categoryList = [];
  let category = [];
  if (parentId == null) {
    category = categories.filter(
      (singleCategory) => singleCategory.parentId == undefined
    );
  } else {
    category = categories.filter(
      (singleCategory) => singleCategory.parentId == parentId
    );
  }

  category.forEach((element) => {
    categoryList.push({
      _id: element.id,
      name: element.name,
      slug: element.slug,
      parentId: element.parentId,
      type: element.type,
      children: createSubCategory(categories, element.id),
    });
  });
  return categoryList;
}

exports.initialData = async (req, res) => {
  const category = await Category.find({}).exec();
  const product = await Product.find({})
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();
  const order = await Order.find({}).exec();
  return res.status(200).json({
    category: createSubCategory(category),
    product,
    order,
  });
};

const category = require("../models/category");
const slugify = require("slugify");
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

exports.addCategory = (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: slugify(req.body.name),
  };
  if (req.body.parentId) categoryObj.parentId = req.body.parentId;

  if (req.file) {
    // categoryObj.categoryImage =
    //   process.env.API_SERVER + "/public/" + req.file.filename; //for local server
    // categoryObj.categoryImage ="/public/" + req.file.filename; //for heroku server
    categoryObj.categoryImage =`${req.file.location}`; //for aws S3

  }
  const newCategory = new category(categoryObj);
  newCategory.save((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category) return res.status(200).json({ category });
  });
};

exports.getCategory = (req, res) => {
  category.find({}).exec((error, categories) => {
    if (error) return res.status(400).json({ error });
    // console.log(categories)
    if (categories) {
      const CategoryList = createSubCategory(categories);
      return res.status(200).json({ CategoryList });
    }
    // return res.status(400).json({message:'No categories present'});
  });
};

exports.updateCategory = async (req, res) => {
  const updatedCategories = [];
  const { name, parentId, type, _id } = req.body;
  // console.log(req.body);
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      // console.log("alkdfjlksafj")
      const Category = {
        name: name[i],
        type: type[i],
      };
      if (parentId[i] !== "") {
        Category.parentId = parentId[i];
      }
      // console.log(Category);
      const updateCategory = await category.findOneAndUpdate(
        { _id: _id[i] },
        Category,
        { new: true }
      );
      // console.log(updateCategory);
      updatedCategories.push(updateCategory);
    }
    return res.status(200).json({ updatedCategories });
  } else {
    const Category = {
      name,
      type,
    };
    if (parentId !== "") {
      Category.parentId = parentId;
    }
    const updateCategory = await category.findOneAndUpdate({ _id }, Category, {
      new: true,
    });
    // console.log(updateCategory);
    updatedCategories.push(updateCategory);
    return res.status(200).json({ updatedCategories });
  }
  // console.log(updatedCategories);

  // console.log(req.body);
};

exports.deleteCategory = async (req, res) => {
  const ids = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteCat = await category.findOneAndDelete({ _id: ids[i] });
    deletedCategories.push(deleteCat);
  }
  if (deletedCategories.length > 0) res.status(200).json({ deletedCategories });
  else res.status(400).json({ msg: "Failed to Delete" });
};

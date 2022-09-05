const Page = require('../models/page');

exports.createPage = (req, res) => {
    const { banners, products } = req.files;
    // console.log(req.files);
    // console.log(banners,products);
    const { category, type, description, title } = req.body;
    const pageObj = { category, type, description, title, createdBy: req.user._id };
    if (banners && banners.length > 0) {
        pageObj.banners = banners.map((banner) => ({
            // img: `${process.env.API_SERVER}/public/${banner.filename}`,
            // img: `/public/${banner.filename}`,
            img: `${banner.location}`, //Path for S3 

            navigateTo: `/bannerClicked?categoryId=${category}&type=${type}`
        }))
    }
    if (products && products.length > 0) {
        pageObj.products = products.map((product) => ({
            // img: `${process.env.API_SERVER}/public/${product.filename}`,
            // img: `/public/${product.filename}`,
            img: `${product.location}`,//Path for S3
            navigateTo: `/productClicked?categoryId=${category}&type=${type}`
        }))
    }

    Page.findOne({ category })
        .exec((error, page) => {
            if (error)
                return res.status(400).json({ error })
            if (page) {
                Page.findOneAndUpdate({ category }, pageObj)
                    .exec((error, updatedPage) => {
                        if (error)
                            return res.status(200).json({ error })
                        if (updatedPage)
                            return res.status(200).json({ page: updatedPage })
                    })
            }
            else {
                const page = new Page(pageObj);
                page.save((error, newPage) => {
                    if (error)
                        return res.status(400).json({ error });
                    if (newPage)
                        return res.status(201).json({ page: newPage });
                });
            }
        })
}

exports.getPage = (req, res) => {
    // console.log(req.params);
    const { category, type } = req.params;
    if (type === 'page') {
        Page.findOne({ category })
            .exec((error, page) => {
                if(error)
                return res.status(400).json({error});
                if(page)
                return res.status(200).json({page});
            })
    }

}
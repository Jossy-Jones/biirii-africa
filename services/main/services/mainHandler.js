const moment = require('moment');
const db = require('../../../database/config');
const Cart = require('../../../models/cart');

//db models
const Category = require('../../../models/db/Category');
const Product = require('../../../models/db/Product');

//helper
const helpers = require('../../../helpers/helpers');

/*
* Static handlers below
*/


module.exports.IndexPage = (req, res)=> {
	res.render("main/index", {
		 pageTitle: "Welcome to Biirii Africa",
		 superCategory: null
	 });
}

module.exports.SuperCategoryHomePage =  async (req, res)=> {	
	let superCategory = req.params.super_category.toLowerCase();


	if (!Product.superCategories.includes(superCategory)) {
		res.status(404).send('Not found');
	}	


	let fetchProductDataBySuperCategories = await Product.fetchBySuperCategories(superCategory);

	let fetchedProducts = fetchProductDataBySuperCategories.products;
	let fetchedCategories = fetchProductDataBySuperCategories.categories;




	res.render("main/home_page", 
		{
			pageTitle: `${helpers.ucwords(superCategory)} - BiiriiAfrica`,
			superCategory: superCategory ,
			products: fetchedProducts,
			categories :fetchedCategories

		});	


}




module.exports.ProductPage = async (req, res)=> {

	let product = await Product.fetchOne({slug : req.params.slug});

	console.log(product.name);


	res.render("main/product", {
		 pageTitle: `${product.name} - BiiriiAfrica`,
		 product: product,
		 superCategory: null
	 });
}

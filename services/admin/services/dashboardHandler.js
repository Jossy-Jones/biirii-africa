/*
*This service handles each page route
*/



const db = require('../../../database/config');

const Category = require('../../../models/db/Category');

//Dashboard entry point
module.exports.Index = (req, res) => {
	res.render("dashboard/login");
}



/*
* All handler methods below are protected if user is logged in
*/


// Home page
module.exports.Home = (req, res) => {

	let orderIsDelivered = false;

	db.query("SELECT * FROM all_orders WHERE is_delivered IS NULL ORDER BY time_added DESC LIMIT 7" , (err, allOrders)=>{	
		db.query("SELECT * FROM product_orders" , (err, productOrders)=>{
			if (err) { throw new Error (err);}

			res.render("dashboard/index",
			 {
			 	pageTitle:`Home - Dashboard (${req.session.adminUsername})`,
			 	orders : (allOrders.length > 0) ? allOrders : null,
			 	productOrders : productOrders
			 });
		});
				
	});

}



// Orders page 
module.exports.OrderList = (req, res) => {
	res.render("dashboard/order_list", {pageTitle:`Orders`});
}

module.exports.OrderMenu = (req, res) => {
	res.render("dashboard/order_menu", {pageTitle:`Order menu`});
}



// Products page  
module.exports.ProductList = (req, res) => {

	db.query('SELECT * FROM products ORDER BY id DESC', (err, row)=> {
		db.query('SELECT * FROM categories ORDER BY id ASC', (err, categories)=> {
			res.render("dashboard/products", 
				{
					pageTitle:`Products`, 
					products: row, 
					categories : categories
				}
			); 
		});
	  	
	});	
	
}

// Add product page  
module.exports.AddProduct = (req, res) => {

	db.query('SELECT * FROM categories ORDER BY id DESC', (err, row)=> {
	  	res.render("dashboard/create_product", {pageTitle:`Add product`, categories : row});
	});
}



// Edit product page  
module.exports.EditProduct = (req, res) => {
	pKey = req.params.key;
	

	db.query('SELECT * FROM products WHERE pKey = ? ORDER BY id DESC', [pKey],(err, product)=> {
		if (product.length > 0) {
			
			db.query('SELECT * FROM categories ORDER BY id ASC', (err, categories)=> {
					db.query('SELECT * FROM sub_products WHERE product_key = ?', [pKey], (err, subProducts)=> {


						if (categories.length > 0) {
							res.render("dashboard/edit_product", 
								{
									pageTitle:`Edit products - ${product[0].name}`, 
									product: product[0],
									categories : categories,
									subProducts : (subProducts.length > 0) ? subProducts : []
							});
						}

					});				


				
			});
		} else {
	  		 res.redirect("/dashboard/404");
		}
	});

}


//Add sub product or variety
module.exports.AddSubProduct = (req, res) => {
	db.query('SELECT * FROM products WHERE pKey = ?', [req.params.pKey], (err, row)=> {
		if (err) throw new Error(err);
		if (!row) res.status(400).send("Not found");


	  	res.render("dashboard/add_sub_product", 
	  		{
	  			pageTitle:`Add variety - ${row[0].name}`,
	  			product : row[0]
	  		});
	});
}


//Add sub product or variety
module.exports.EditSubProduct = (req, res) => {
	let id = req.params.key; // sub product id in the db

	db.query('SELECT * FROM sub_products WHERE id = ?', [id], (err, row)=> {
		if (err) throw new Error(err);
		if (!row) res.status(400).send("Not found");

		let sp = row[0];


		db.query("SELECT * FROM products WHERE pKey = ?", [sp.product_key], (err, row)=>{
			if (err) throw new Error(err);

			let p = row[0];


			res.render("dashboard/edit_sub_product", 
				{
					pageTitle : `Edit variety - ${p.name} - ${sp.name}`,
					subProduct : sp,
					product : p
				});
		});
	});
}




// Categories page  
module.exports.Categories = (req, res) => {
	db.query('SELECT * FROM categories ORDER BY id DESC', (err, row)=> {
	  	res.render("dashboard/categories", {pageTitle:`Categories`, categories : row});
	});
}

// Add Category page  
module.exports.AddCategory = (req, res) => {
	db.query("SELECT * FROM super_categories",(err, superCategories)=> {

		res.render("dashboard/create_category", 
			{
				pageTitle:`Add category`,
				superCategories : superCategories
			});

	});
	;
}


// Edit Category page  
module.exports.EditCategory = (req, res) => {
	let id = req.params.key;
	db.query('SELECT * FROM categories WHERE id = ?', id, (err, row)=> {

		if (row.length > 0) {
			res.render("dashboard/edit_category", 
				{
					pageTitle:`Edit category - ${row[0].name}`,
					category : row[0]
			});
		} else {
			res.redirect("/dashboard/404");
		}
	});

}


// Customer Order page  
module.exports.CustomerOrder = (req, res) => {
	db.query("SELECT * FROM products", (err, products)=> {
		db.query("SELECT * FROM all_orders WHERE order_key = ?", req.params.order_key, (err, allOrders)=> {
			db.query("SELECT * FROM product_orders WHERE order_key = ?", req.params.order_key, (err, productOrders)=> {
					 
						let order = allOrders[0];

						res.render("dashboard/order", 
							{
								pageTitle : `Order - ${req.params.order_key} - Dashboard`, 
								order : order,
								key : req.params.order_key,
								productOrders : productOrders,
								products : products
							});
				
			});	
		})
	});
}




// New orders
module.exports.NewOrders = (req, res) => {


	db.query("SELECT * FROM all_orders WHERE is_delivered IS NULL ORDER BY time_added DESC" , (err, allOrders)=>{	
		db.query("SELECT * FROM product_orders" , (err, productOrders)=>{
			if (err) { throw new Error (err);}

			res.render("dashboard/new_orders_list",
			 {
			 	pageTitle:`New orders`,
			 	orders : (allOrders.length > 0) ? allOrders : null,
			 	productOrders : productOrders
			 });
		});
				
	});

}



// Delivered orders
module.exports.DeliveredOrders = (req, res) => {

	let orderIsDelivered = false;

	db.query("SELECT * FROM all_orders WHERE is_delivered = 1 ORDER BY time_added DESC" , (err, allOrders)=>{	
		db.query("SELECT * FROM delivered_orders" , (err, deliveredOrders)=>{
			if (err) { throw new Error (err);}

			res.render("dashboard/delivered_order_list",
			 {
			 	pageTitle:`Delivered orders`,
			 	orders : (allOrders.length > 0) ? allOrders : null,
			 	deliveredOrders : deliveredOrders
			 });
		});
				
	});

}

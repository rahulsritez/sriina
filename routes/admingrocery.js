const xss = require("xss");

/*exports.groceryPage = function(req, res){
    var user =  req.session.user,
        userId = req.session.userId;
    var sql1="Select * from books_category where is_deleted=0";
    var query = db.query(sql1, function(err, result) {
        if(req.session.type==1){
            var sql2="SELECT p.*,c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.status=1 and product_type_id=2 order by id desc";
        } else {
            var sql2="SELECT p.*,c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.status=1 and product_type_id=2 and`user_id`='"+userId+"' and `user_id`!='0' order by id desc";
        }
        
        var query = db.query(sql2, function(err, result1) {
            if (err) throw err;
                let get_units ="SELECT * FROM unit_master WHERE status='1' ";
                db.query(get_units, function(error, get_units_data) {
                    if(error) throw new Error('units data');
                        var sql_grocery="SELECT id,name FROM grocery_category WHERE status=1";
                        var query = db.query(sql_grocery, function(err, get_grocery_list) {
                            res.render('admin/grocery', {'categorylist': result,'productlist': result1,message:req.flash('message'),errors:req.flash('errors'),get_units_data:get_units_data,'get_grocery_list':get_grocery_list});
                        });
                });
            });
        });
};*/

exports.groceryPage = function(req, res){
    var userId = req.session.userId;
    var userType = req.session.type;
    if(userId == null && userType==null){
        res.redirect("/admin");
    }
    var user =  req.session.user,
        userId = req.session.userId;
    var sql1="Select * from books_category where is_deleted=0";
    var query = db.query(sql1, function(err, result) {

        if(userType==1){
            var sql2 = "SELECT p.id,p.`product_type_id`,p.`name`,p.`delivery_charge`,p.`sku`,p.`description`,p.`slug`,p.`status`,p.`unit`,p.`grocery_category`,p.`grocery_sub_category`, pi.`grocery_image` as `groceyimage`, pv.`unit_price` as `price`, pv.`unit_id` as `unit_id`, pv.`unit_discount` as `discount`, pv.`inventory` as `quantity`, pv.`unit_weight` as `weight`, um.`name` as `unit_title` FROM `products` as p, `products_images` as pi, `product_variables` as pv, `unit_master` as um where p.`id` = pi.`product_id` and p.`id` = pv.`product_id` and pv.`unit_id` = um.`id` and p.product_type_id=2 order by p.id desc";
            
        } else {
            var sql2 = "SELECT p.id,p.`product_type_id`,p.`name`,p.`delivery_charge`,p.`sku`,p.`description`,p.`slug`,p.`status`,p.`unit`,p.`grocery_category`,p.`grocery_sub_category`, pi.`grocery_image` as `groceyimage`, pv.`unit_price` as `price`, pv.`unit_id` as `unit_id`, pv.`unit_discount` as `discount`, pv.`inventory` as `quantity`, pv.`unit_weight` as `weight`, um.`name` as `unit_title` FROM `products` as p, `products_images` as pi, `product_variables` as pv, `unit_master` as um where p.`id` = pi.`product_id` and p.`id` = pv.`product_id` and pv.`unit_id` = um.`id` and p.product_type_id=2 order by p.id and p.`user_id`='"+userId+"' and p.`user_id`!='0' desc";
        }
        if(userType==5){
            var sidebar = 'seosidebar';
        } else if(userType==2) {
           var sidebar =  'dataentrysidebar';
       } else {
            var sidebar  = 'sidebar';
        }
        var query = db.query(sql2, function(err, result1) {
            if (err) throw err;
                let get_units ="SELECT * FROM unit_master WHERE status='1' ";
                db.query(get_units, function(error, get_units_data) {
                    if(error) throw new Error('units data');
                        var sql_grocery="SELECT id,name FROM grocery_category WHERE status=1";
                        var query = db.query(sql_grocery, function(err, get_grocery_list) {
                                let get_manufacturer ="SELECT * FROM manufacturer WHERE status=1";
                                db.query(get_manufacturer, function(error, manufacturer_data) {
                                    if(error) throw new Error('manufacturer table fetch problem');
                                    res.render('admin/grocery', {'categorylist': result,'productlist': result1,message:req.flash('message'),errors:req.flash('errors'),get_units_data:get_units_data,'get_grocery_list':get_grocery_list,csrfToken: req.csrfToken(),sidebar,manufacturer_data});
                                });
                        });
                });
            });
        });
};


/*exports.addGroceryProduct = function(req,res,next){
    var slugify    = require('slugify');
    var formidable = require('formidable');
    var fs         = require('fs');
    var user =  req.session.user, userId = req.session.userId, type = req.session.type;

    if(userId == null){
        res.render('admin/admin',{message: '',message_success:''})
    }
    const multer   = require('multer');
    const path     = require('path');
        const storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, './public/admin/grocery/images/');
            },
          
            filename: function(req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });
        //limits: { fileSize: 1 * 1024 * 1024 },
    let uploadFiles = multer({ storage: storage,fileFilter:(req, file, cb) =>{
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!');
            err.name = 'ExtensionError'
            res.status(200).json({ message: 'Only .png, .jpg and .jpeg format allowed!'}); 
            return;
            // return cb(err);
        }
        }
    }).array("grocery_product_images", 5);

    if(req.method == 'POST' && req.url == '/addgroceryproduct'){
        uploadFiles(req, res, (err) => {
            if (err) {
                console.log(err);
            } else {
                if (req.files == "undefined" && req.files=="") {
                    console.log("No image selected!")
                } else {
                    var today = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    let fields = req.body;
                    let product_type_id = fields.product_type_id;
                    let product_name = xss(fields.grocery_product_name);
                    let g_price = xss(fields.grocery_price);
                    let g_inventory = xss(fields.grocery_inventory);
                    let units_data = xss(fields.get_units_data);
                    let delivery_charge = xss(fields.grocery_delivery_charge);
                    let g_category = xss(fields.grocery_category);
                    let g_sub_category = xss(fields.grocery_sub_category);
                    let g_tax = xss(fields.grocery_tax);
                    let g_status = xss(fields.grocery_status);
                    let g_descriptions = xss(fields.grocery_descriptions);
                    let g_weight = xss(fields.grocery_weight);
                    let g_discount = xss(fields.grocery_discount);
                    
                    let slug_url = slugify(product_name,{replacement: '-',remove: /[,*+~.()'"!:@]/g,lower: true,strict: false});
                    
                    if(!product_name){
                        req.flash('errors','Product name cannot be empty.');
                        res.redirect("/grocerylist");
                    } else {
                        let sql12 = "INSERT INTO `products`(`user_id`,`product_type_id`,`name`,`unit`,`delivery_charge`,`grocery_category`,`grocery_sub_category`,`tax_included`,`status`,`description`,`slug`,`created_at`,`updated_at`) VALUES ('"+userId+"', '"+product_type_id+"', '"+product_name+"', '"+units_data+"', '"+delivery_charge+"','"+g_category+"','"+g_sub_category+"','"+g_tax+"', '"+g_status+"', '"+g_descriptions+"', '"+slug_url+"', '"+today+"','"+today+"')";
                        //console.log(sql12);
                        var query = db.query(sql12, function(error, result) {
                            if(error){
                                req.flash('errors','Something went wrong please try again.');
                                res.redirect("/grocerylist");
                            } else {
                                let lastId = result.insertId;
                                for (let i=0; i < req.files.length; i++) {
                                    var sql = "INSERT INTO `products_images`(`user_id`,`product_id`,`grocery_image`,`created_at`,`updated_at`) VALUES('"+userId+"','"+lastId+"','"+req.files[i].filename+"','"+today+"','"+today+"')";
                                     query = db.query(sql, function(error, grocery_img) {
                                        if(error){
                                            console.log(error);
                                        } else {
                                            console.log('Product images Inserted');
                                        }
                                    });
                                  }

                                for (let i=0; i < fields.grocery_price.length; i++) {
                                    var sql = "INSERT INTO `product_variables`(`user_id`,`product_id`,`unit_id`,`unit_price`,`inventory`,`unit_weight`,`unit_discount`,`created_at`,`updated_at`) VALUES('"+userId+"','"+lastId+"','"+units_data+"','"+fields.grocery_price[i]+"','"+fields.grocery_inventory[i]+"','"+fields.grocery_weight[i]+"','"+fields.grocery_discount[i]+"','"+today+"','"+today+"')";
                                     query = db.query(sql, function(error, product_vaiable) {
                                        if(error){
                                            console.log(error);
                                        } else {
                                             console.log('Product variables Inserted');
                                        }
                                     });
                                }  
                                  req.flash('message','Grocery product has been successfully added.');
                                  res.redirect("/grocerylist");
                            }
                        });
                    }
                }
            }
        });
    } else {
        req.flash('errors','Something went wrong please try again.');
        res.redirect("/grocerylist");
    }
}*/


exports.addGroceryProduct = (req,res) =>{
    var slugify    = require('slugify');
    var formidable = require('formidable');
    var fs         = require('fs');
    var user =  req.session.user, userId = req.session.userId, type = req.session.type;

    if(userId == null){
        res.render('admin/admin',{message: '',message_success:''})
    }
    const multer   = require('multer');
    const path     = require('path');
        const storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, './public/admin/grocery/images/');
            },
          
            filename: function(req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });
        //limits: { fileSize: 1 * 1024 * 1024 },
    let uploadFiles = multer({ storage: storage,fileFilter:(req, file, cb) =>{
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!');
            err.name = 'ExtensionError'
            res.status(200).json({ message: 'Only .png, .jpg and .jpeg format allowed!'}); 
            return;
            // return cb(err);
        }
        }
    }).array("grocery_product_images", 5);


    if(req.method == 'POST' && req.url == '/addgroceryproduct'){
        uploadFiles(req, res, (err) => {
            if (err) {
                console.log(err);
            } else {
                if (req.files == "undefined" && req.files=="") {
                    console.log("No image selected!")
                } else {
                    var today = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    let fields = req.body;
                    let product_type_id = fields.product_type_id;
                    let product_name = xss(fields.grocery_product_name).replace(/'/g, "'\'");
                    let g_price = xss(fields.grocery_price);
                    let g_inventory = xss(fields.grocery_inventory);
                    let units_data = xss(fields.get_units_data);
                    let delivery_charge = xss(fields.grocery_delivery_charge);
                    let g_category = xss(fields.grocery_category);
                    let g_sub_category = xss(fields.grocery_sub_category);
                    let g_tax = xss(fields.grocery_tax);
                    let g_status = xss(fields.grocery_status);
                    let g_descriptions = xss(fields.grocery_descriptions).replace(/'/g, "'\'");
                    let g_weight = xss(fields.grocery_weight);
                    let g_discount = xss(fields.grocery_discount);

                    let features_details = xss(fields.features_details);
                    let disclaimer = xss(fields.grocery_disclaimer);

                    let g_manufacturer  = xss(fields.manufacturer);
                    let g_brand         = xss(fields.brand);
                    let g_food_country  = xss(fields.food_country);
                    let g_food_type     = xss(fields.food_type);
                    
                    let slug_url = slugify(product_name,{replacement: '-',remove: /[,*+~.()'"!:@]/g,lower: true,strict: false});
                    let sku = Math.floor(Math.random() * 100);
                    if(!product_name){
                        req.flash('errors','Product name cannot be empty.');
                        res.redirect("/grocerylist");
                    } else {
                        let sql12 = "INSERT INTO `products`(`user_id`,`product_type_id`,`name`,`unit`,`delivery_charge`,`sku`,`cat_id`,`sub_category`,`tax_included`,`status`,`description`,`features_details`,`disclaimer`,`slug`, `manufacturer_id`, `brand_id`, `country_id`, `food_type`,`created_at`,`updated_at`) VALUES ('"+userId+"', '"+product_type_id+"', '"+product_name+"', '"+units_data+"', '"+delivery_charge+"','"+sku+"','"+g_category+"','"+g_sub_category+"','"+g_tax+"', '"+g_status+"', '"+g_descriptions+"', '"+features_details+"',  '"+disclaimer+"', '"+slug_url+"', '"+g_manufacturer+"', '"+g_brand+"', '"+g_food_country+"', '"+g_food_type+"', '"+today+"','"+today+"')";
                        
                        var query = db.query(sql12, function(error, result) {
                            if(error){
                                req.flash('errors','Something went wrong please try again.');
                                res.redirect("/grocerylist");
                            } else {
                                let lastId = result.insertId;
                                for (let i=0; i < req.files.length; i++) {
                                    var sql = "INSERT INTO `products_images`(`user_id`,`product_id`,`grocery_image`,`created_at`,`updated_at`) VALUES('"+userId+"','"+lastId+"','"+req.files[i].filename+"','"+today+"','"+today+"')";
                                     query = db.query(sql, function(error, grocery_img) {
                                        if(error){
                                            console.log(error);
                                        } else {
                                            console.log('Product images Inserted');
                                        }
                                    });
                                  }

                                for (let i=0; i < fields.grocery_price.length; i++) {
                                    var sql = "INSERT INTO `product_variables`(`user_id`,`product_id`,`unit_id`,`unit_price`,`inventory`,`unit_weight`,`unit_discount`,`created_at`,`updated_at`) VALUES('"+userId+"','"+lastId+"','"+units_data+"','"+fields.grocery_price[i]+"','"+fields.grocery_inventory[i]+"','"+fields.grocery_weight[i]+"','"+fields.grocery_discount[i]+"','"+today+"','"+today+"')";
                                     query = db.query(sql, function(error, product_vaiable) {
                                        if(error){
                                            console.log(error);
                                        } else {
                                             console.log('Product variables Inserted');
                                        }
                                     });
                                }  
                                  req.flash('message','Grocery product has been successfully added.');
                                  res.redirect("/grocerylist");
                            }
                        });
                    }
                }
            }
        });
    } else {
        req.flash('errors','Something went wrong please try again.');
        res.redirect("/grocerylist");
    }
}

exports.updateGroceryProducts = (req, res) => {
    
}
exports.admin404 = function(req,res){
    res.render('admin/admin404');
}

exports.getBrands = function(req, res){
    var id = req.body.id;
    var sql = "SELECT id,name FROM brand WHERE manufacturer_id='"+id+"' and status=1";
    var query = db.query(sql, function(error, results) {
        if(error) throw new Error('Brand problems');
        res.send(results);
    });
}
const _ = require('underscore');
const { forEach } = require('p-iteration');
var base64 = require('base-64');

exports.groceryIndex = function(req, res){
    let title = 'Grocery Page'
    let sql = "SELECT * FROM grocery_category where status=1";
    const perPage = 10;

    const page = req.query.page || 1;
    const offset = (page - 1) * perPage;
    let sortBy = 'p.no_of_volumes DESC';
    if(req.query.sort == 'high_to_low'){
        sortBy = 'pv.unit_price DESC';
    } else if(req.query.sort == 'low_to_high'){
        sortBy = 'pv.unit_price ASC';
    } else if(req.query.sort == 'discount'){
        sortBy = 'pv.unit_discount DESC';
    }

    let filterByPrice = '';
    if(req.query.min && req.query.max && req.query.min_discount && req.query.max_discount){
        filterByPrice = 'and pv.unit_discount_price >= '+req.query.min+' and pv.unit_discount_price <= '+req.query.max+' and pv.unit_discount >= '+req.query.min_discount+' and pv.unit_discount <= '+req.query.max_discount;
    } else if(req.query.min && req.query.max){
        filterByPrice = 'and pv.unit_discount_price >= '+req.query.min+' and pv.unit_discount_price <= '+req.query.max;
    } else if(req.query.min_discount && req.query.max_discount){
        filterByPrice = 'and pv.unit_discount >= '+req.query.min_discount+' and pv.unit_discount <= '+req.query.max_discount;
    }

    let query = db.query(sql, function(error, result){
        if(error) throw new Error('failed to connect Grocery Category');
        let sql_product = "SELECT p.*, pi.grocery_image as image, pv.unit_price as price, pv.unit_discount as discount, pv.unit_weight, um.name as unit_title FROM products as p, products_images as pi, product_variables as pv, unit_master as um where p.id = pi.product_id and p.id = pv.product_id and pv.unit_id = um.id and p.product_type_id=2 and p.status=1 "+filterByPrice+" group by p.id order by "+sortBy+", pi.id DESC,pv.id ASC limit "+perPage+" OFFSET "+offset;
        //console.log(sql_product);
        db.query(sql_product, async(error, result_product) => {
            //result_product = JSON.parse(JSON.stringify(result_product));
            _.each(result_product, (element, index) => {
                result_product[index]['image'] = baseURL+'admin/grocery/images/'+element.image;
            });

            if(error) throw new Error('failed to connect Product');
            let sql_plan = "SELECT MAX(plan_price) as MaxPlanPrice FROM plans";
            db.query(sql_plan, function(error, maxplan){
                if(error) throw new Error('failed to connect Max Plan');

                let filter_product = "SELECT p.*, pi.grocery_image as image, pv.unit_price as price, pv.unit_discount as discount, pv.unit_weight, um.name as unit_title FROM products as p, products_images as pi, product_variables as pv, unit_master as um where p.id = pi.product_id and p.id = pv.product_id and pv.unit_id = um.id and p.product_type_id=2 and p.status=1 "+filterByPrice+" group by p.id order by "+sortBy+", pi.id ASC,pv.id ASC";
                db.query(filter_product, function(error,filter_count){
                    let total_product = "SELECT p.*, pi.grocery_image as image, pv.unit_price as price, pv.unit_discount as discount, pv.unit_weight, um.name as unit_title FROM products as p, products_images as pi, product_variables as pv, unit_master as um where p.id = pi.product_id and p.id = pv.product_id and pv.unit_id = um.id and p.product_type_id=2 and p.status=1 group by p.id order by "+sortBy+", pi.id ASC,pv.id ASC";
                    db.query(total_product, function(error,total_count){
                        //console.log(total_count.length);
                        let discountedPrice = 0;
                        _.each(total_count, (element, index) => {
                            discountedPrice = (element.price * element.discount) / 100;
                            total_count[index]['discounted_price'] = element.price - discountedPrice;
                        });

                        let discountArr = total_count;
                        discountArr.sort(function(a, b) { 
                            return a.discount- b.discount;
                        })

                        if(error) throw new Error('products tbl data error');
                        let qw = filter_count.length;
                        let jsonResult = {  
                            'products_page_count':result_product.length,
                            'current':page,
                            'products':result_product,
                            'pages' : Math.ceil(qw/perPage),
                        }

                        let myJsonString = JSON.parse(JSON.stringify(jsonResult));
                        res.render('grocery/design',{page, total_count: filter_count.length, min_discount_val: req.query.min_discount || (discountArr.length > 0 ? discountArr[0]['discount'] : 0), max_discount_val: req.query.max_discount || (discountArr.length > 0 ? discountArr[discountArr.length - 1]['discount'] : 0), min_val: req.query.min || (total_count.length > 0 ? Math.floor(total_count[0]['discounted_price']) : 0), min: (total_count.length > 0 ? Math.floor(total_count[0]['discounted_price']) : 0), max_val: req.query.max || (total_count.length > 0 ? Math.ceil(total_count[total_count.length - 1]['discounted_price']) : 0), max: (total_count.length > 0 ? Math.ceil(total_count[total_count.length - 1]['discounted_price']) : 0), min_discount: (discountArr.length > 0 ? discountArr[0]['discount'] : 0), max_discount: (discountArr.length > 0 ? discountArr[discountArr.length - 1]['discount'] : 0), 'title':title,'categorylist': result, 'products': result_product, maxplan, myJsonString, get_url_name: '',base64});
                    })
                })
            })
        })
    });
}

exports.viewGroceryProduct = (req,res)=>{
    let Ids = base64.decode(req.params.id);
    let sqlProductInfo = "SELECT p.id,p.`product_type_id`,p.`name`,p.`delivery_charge`,p.`sku`,p.`description`, p.`features_details`, p.`product_information`, p.`disclaimer`, p.`food_type`, p.`slug`,p.`status`,p.`unit`,p.`grocery_category`,p.`grocery_sub_category`, pi.`grocery_image` as `image`, pv.`unit_price` as `price`, pv.`unit_discount` as `discount`, pv.`inventory` as `quantity`, pv.`unit_weight`, um.`name` as `unit_title`, b.`name` as `brand_name`, m.`name` as `manufacturer_name` FROM `products` as p, `products_images` as pi, `product_variables` as pv, `unit_master` as um, `brand` as b, `manufacturer` as m where p.`id` = pi.`product_id` and p.`id` = pv.`product_id` and pv.`unit_id` = um.`id` and p.`manufacturer_id` = m.`id` and p.`brand_id` = b.`id` and p.`id`="+Ids+" group by p.id";
    // console.log(sqlProductInfo);
        db.query(sqlProductInfo, (error, productInfo) => {
            if(productInfo.length > 0){
                let sqlProductImages = "SELECT grocery_image from products_images where product_id='"+Ids+"'";
                db.query(sqlProductImages, function(error, productImages) {
                    if(error) throw new Error('failed to product images');
                    _.each(productImages, (element, index) => {
                        productImages[index]['grocery_image'] = baseURL+'admin/grocery/images/'+element.grocery_image;
                    });

                    res.render('grocery/product_details', {
                        title: productInfo[0]['name'],
                        productInfo: productInfo[0],
                        productImages,
                        message:req.flash('message'),csrfToken: req.csrfToken()
                    });
                })
            } else {
                res.redirect(baseURL+'grocery');
            }
        });
}

exports.addtoCartGroceryProducts = (req,res)=>{
    if(req.method == "POST"){
        //console.log(req.headers.referer); return;
        var userId = req.session.userId;
        var today = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if(userId==null){
            res.redirect('/sign-in');
        } else {
            var post  = req.body;
            var product_id = post.product_id;
            var quantity = post.quantity;
            //console.log(post); return;
            var SQL = "SELECT * FROM `cart` WHERE `user_id` = '"+userId+"' and `status`='0'";
            var query = db.query(SQL, function(err, results){
                if(results.length==1 ){
                    var cart_update = "SELECT * FROM `cart_product` WHERE `cart_id`='"+results[0].cart_id+"' and product_id='"+product_id+"'";
                    var query = db.query(cart_update, function(err, cart_update){
                        if(cart_update.length==1){
                            var new_quantity = parseInt(cart_update[0].quantity) +parseInt(quantity);
                            //console.log(new_quantity); return;
                            var cats_product = "UPDATE `cart_product` SET `quantity`='"+new_quantity+"' WHERE id='"+cart_update[0].id+"'";
                            var query = db.query(cats_product, function(error,cartresult){
                                if(error){
                                    console.log(error);
                                } else {
                                    res.redirect('addtocart');
                                }
                            })
                        } else {
                            let cart_product = "INSERT INTO `cart_product`(`cart_id`,`product_id`,`quantity`,`created_at`,`updated_at`) VALUES('"+results[0].cart_id+"','"+product_id+"','"+quantity+"','"+today+"','"+today+"')";
                            var query = db.query(cart_product,function(err, insertedcart){
                                res.redirect('addtocart');
                            });
                        }
                    });
                } else {
                    let cart_insert = "INSERT INTO `cart`(`user_id`,`status`,`created_at`,`updated_at`) VALUES('"+userId+"','"+0+"','"+today+"','"+today+"')";
                    var query = db.query(cart_insert, function(err, result) {
                        let cart_product = "INSERT INTO `cart_product`(`cart_id`,`product_id`,`quantity`,`created_at`,`updated_at`) VALUES('"+result.insertId+"','"+product_id+"','"+quantity+"','"+today+"','"+today+"')";
                        var query = db.query(cart_product,function(err, insertedcart){
                            res.redirect('addtocart');
                        });
                    });
                }
            });
        }
    }
}
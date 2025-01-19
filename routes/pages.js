const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const { Readable } = require('stream');
const { create } = require('xmlbuilder2');
let sitemap;
var base64 = require('base-64');

exports.siteMapMethod = (req,res) =>{
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    // if (sitemap) {
    //     res.send(sitemap)
    //     return;
    //   }
      try {
            const str = req.url;
            const match = str.match(/(\d+)\.xml$/);
            const pageNumber = parseInt(match[1], 10);
            const limit = 5000;
            
            const offset = (pageNumber - 1) * limit;

	      	var sql = `SELECT id,slug FROM products where status='1' LIMIT ${limit} OFFSET ${offset}`;
	        var query = db.query(sql, function(error, results){
            if(error) throw new Error('Products Table ERROR.');
            const smStream = new SitemapStream({ hostname: 'https://sriina.com', xmlns: {
                news: false,
                xhtml: false,
                image: false,
                video: false,
            }, });
            const pipeline = smStream.pipe(createGzip());
            var resultArray = JSON.parse(JSON.stringify(results));
            if (resultArray.length === 0) {
                smStream.write({ url: 'https://sriina.com', changefreq: 'daily', priority: 1.0 });
            } else {
                resultArray.forEach(function(list,index){
                    let slugutl = list.slug +"/"+ list.id;
                    smStream.write({ url: slugutl,  changefreq: 'daily', priority: 1.0 })
                    /*let slugutl = list.slug +"/"+ list.id;
                    smStream.write({ url: slugutl,  changefreq: 'daily', priority: 0.3 })*/
                })
            }
           
            streamToPromise(pipeline).then(sm => sitemap = sm)
            // make sure to attach a write stream such as streamToPromise before ending
            smStream.end()
            // stream write the response
            pipeline.pipe(res).on('error', (e) => {throw e})
        });
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
}

function sanitize(text) {
    if (!text) return '';
    return text
      .replace(/&nbsp;/g, '&#160;')
      .replace(/&/g, '&amp;')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
  }

exports.categoryXML = (req,res) =>{
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
      try {
            const str = req.url;
            const match = str.match(/(\d+)\.xml$/);
            const pageNumber = parseInt(match[1], 10);
            const limit = 5000;
            
            const offset = (pageNumber - 1) * limit;

	      	var sql = `SELECT * FROM products LIMIT ${limit} OFFSET ${offset}`;
	        var query = db.query(sql, function(error, results){
            if(error) throw new Error('Products Table ERROR.');
            var resultArray = JSON.parse(JSON.stringify(results));
            const root = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('rss', { 'xmlns:g': 'http://base.google.com/ns/1.0', version: '2.0' })
            .ele('channel');
            root.ele('title').txt('Sriina');
            root.ele('link').txt('https://sriina.com/');

            resultArray.forEach(function(product,index){
                const item = root.ele('item');

                const discountPercentage = product.discount;
                const discountAmount = (parseInt(product.price, 10).toFixed(2) * discountPercentage ) / 100;
                const salePrice = parseInt(product.price, 10).toFixed(2) - discountAmount;

                item.ele('title').txt(sanitize(product.name));
                item.ele('link').txt(`https://sriina.com/${product.slug}/${product.id}`);
                item.ele('description').txt(sanitize(product.description));
                item.ele('g:price').txt(`${salePrice} INR`);
                item.ele('g:availability').txt(product.quantity > 0 ? 'In Stock' : 'Out of stock');
                item.ele('g:condition').txt('New');
                item.ele('g:id').txt(product.id);
                item.ele('g:image_link').txt(`${process.env.IMAGE_URL}${product.image}`);
                item.ele('g:product_type').txt('Book');

                const shipping = item.ele('g:shipping');
                shipping.ele('g:country').txt('IN');
                shipping.ele('g:price').txt(product.delivery_charge);

                item.ele('g:brand').txt('Sriina');
                item.ele('g:identifier_exists').txt('No');
            })

            const xmlString = root.end({ prettyPrint: true });

            const gzip = createGzip();
            res.status(200);
            gzip.pipe(res);
            gzip.end(xmlString);
        });
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
}

// exports.aboutPage = (req, res, next) => {
//     let title = 'About us';
//     var sql = "SELECT * FROM books_category where is_deleted=0";
//     var query = db.query(sql, function(error, result){
//         if(error) throw error;
//         var sql = "SELECT `title`, `description` FROM `pages` WHERE `id`='1' and `status` = '0'";
//         var query = db.query(sql, function(error, getpages){
//             if(error) throw error;
//             res.render('front/aboutus',{'title':title,'categorylist':result, getresult:getpages[0] });
//         });
//     });
// }

exports.returnPolicy = (req, res, next) => {
    let title = 'Return Policy';
    var sql = "SELECT * FROM books_category where is_deleted=0";
    var query = db.query(sql, function(error, result){
        if(error) throw error;
        var sql = "SELECT `title`, `description` FROM `pages` WHERE `id`='2' and `status` = '1'";
        var query = db.query(sql, function(error, getpages){
            if(error) throw error;
            res.render('front/returnpolicy',{'title':title,'categorylist':result, getresult:getpages[0] });
        });
    });
}

exports.privacyPolicy = (req, res, next) => {
    let title = 'Privacy Policy';
    var sql = "SELECT * FROM books_category where is_deleted=0";
    var query = db.query(sql, function(error, result){
        if(error) throw error;
        var sql = "SELECT `title`, `description` FROM `pages` WHERE `id`='3' and `status` = '1'";
        var query = db.query(sql, function(error, getpages){
            if(error) throw error;
            res.render('front/privacypolicy',{'title':title,'categorylist':result, getresult:getpages[0] });
        });
    });
}

exports.cancellationReturns = (req, res, next) => {
    let title = 'Cancellation Returns';
    var sql = "SELECT * FROM books_category where is_deleted=0";
    var query = db.query(sql, function(error, result){
        if(error) throw error;
        var sql = "SELECT `title`, `description` FROM `pages` WHERE `id`='4' and `status` = '1'";
        var query = db.query(sql, function(error, getpages){
            if(error) throw error;
            res.render('front/cancellationreturns',{'title':title,'categorylist':result, getresult:getpages[0] });
        });
    });
}

exports.security = (req, res, next) => {
    let title = 'Security';
    var sql = "SELECT * FROM books_category where is_deleted=0";
    var query = db.query(sql, function(error, result){
        if(error) throw error;
        var sql = "SELECT `title`, `description` FROM `pages` WHERE `id`='5' and `status` = '1'";
        var query = db.query(sql, function(error, getpages){
            if(error) throw error;
            res.render('front/security',{'title':title,'categorylist':result, getresult:getpages[0] });
        });
    });
}

exports.aboutPage = (req, res, next) => {
    let title = 'About us';
    var sql = "SELECT * FROM books_category where is_deleted=0";
    var query = db.query(sql, function(error, result){
        if(error) throw error;
        var sql = "SELECT `title`, `description` FROM `pages` WHERE `id`='1' and `status` = '1'";
        var query = db.query(sql, function(error, getpages){
            if(error) throw error;
            res.render('front/aboutus',{'title':title,'categorylist':result, getresult:getpages[0] });
        });
    });
}

exports.termsPage = (req, res, next) => {
    let title = 'Terms & Condition';
    var sql = "SELECT * FROM books_category where is_deleted=0";
    var query = db.query(sql, function(error, result){
        if(error) throw error;
        var sql = "SELECT `title`, `description` FROM `pages` WHERE `id`='6' and `status` = '1'";
        var query = db.query(sql, function(error, getpages){
            if(error) throw error;
            res.render('front/terms_conditions',{'title':title,'categorylist':result, getresult:getpages[0] });
        });
    });
}

exports.shippingDeliveryPage = (req, res, next) => {
    let title = 'Shipping & Delivery';
    var sql = "SELECT * FROM books_category where is_deleted=0";
    var query = db.query(sql, function(error, result){
        if(error) throw error;
        var sql = "SELECT `title`, `description` FROM `pages` WHERE `id`='7' and `status` = '1'";
        var query = db.query(sql, function(error, getpages){
            if(error) throw error;
            res.render('front/shipping_delivery',{'title':title,'categorylist':result, getresult:getpages[0] });
        });
    });
}

exports.contactPage = (req, res) => {
    let title = 'Contact'
    let sql = "SELECT * FROM books_category where is_deleted=0";
    let query = db.query(sql, function(err, result){
        res.render('front/contact',{'title':title,'categorylist': result});
    });
}




/*exports.getCategories = function(req, res, next){
    try{
    var perPage = 5;
    var page = req.query.page;
    var offset = (page - 1) * perPage;
    var qs = req.query;

    var qs = req.query;
    let sql = "SELECT `cat_id`,`url_name` FROM category_url WHERE url_name = '"+req.params.id+"'";
    var query = db.query(sql, function(error,getCat_id){
        if(error) throw new Error('category url not found in categroy_url table');
        if(getCat_id.length>0){
            let catId = getCat_id[0].cat_id;
            let url_name = getCat_id[0].url_name;

            let sql = "SELECT * FROM products where is_deleted=0 and cat_id='"+catId+"'";
            let query = db.query(sql, function(error, result){
                if(error) throw new Error('products table Data Problem');

                var prodsQuery = '';
                if(typeof page == 'undefined'){
                    prodsQuery = "SELECT * FROM products where status='1' and cat_id='"+catId+"' order by id desc limit "+perPage+" ";
                } else {
                    var offset = parseInt((page - 1)) * parseInt(perPage); 
                    prodsQuery = "SELECT * FROM products where status='1' and cat_id='"+catId+"' order by id desc limit "+perPage+" OFFSET "+offset;
                }

                    var query = db.query(prodsQuery, function(error, results, fields){
                    var qw = result.length;
                    var jsonResult = {
                        'current':page,
                        'products':results,
                        'pages' : Math.ceil(qw/perPage),
                    }
                    var myJsonString = JSON.parse(JSON.stringify(jsonResult));

                let sql2 = "SELECT * from books_category where id='"+catId+"' and is_deleted=0";
                let query = db.query(sql2, function(error, getmeta){
                    if(error) throw new Error('books_category Table Problem');
                    var sql_plan = "SELECT MAX(plan_price) as MaxPlanPrice FROM plans";
                    var query = db.query(sql_plan, function(error, maxplan){
                        if(error) throw new Error('plans Table Problem')
                        var allcat = "SELECT * from books_category where is_deleted=0 order by name;"
                        var query = db.query(allcat,function(error,getcategory){
                            if(error) throw new Error('books_category table problem');
                            res.render('front/productbycategory',{getmeta: getmeta[0],categorylist: getcategory, productlist: result, maxplan:maxplan,get_url_name:url_name,myJsonString:myJsonString});
                        });
                    });
                });
            });
        });
        } else {
            res.redirect("/error_page");
        }
    });
    }catch(error){
        console.log(error);
    }
}*/

exports.getCategories = function(req, res, next){
    try{
        var perPage = 10;
        var page = req.query.page;
        var offset = (page - 1) * perPage;
        var qs = req.query;
        let sql = "SELECT `cat_id`,`url_name`,`category_type_id` FROM `category_url` WHERE `url_name` = '"+req.params.id+"'";
        var query = db.query(sql, function(error,getCat_id){
            if(error) throw new Error('category url not found in categroy_url table');
            if(getCat_id.length>0){
                let catId = getCat_id[0].cat_id;
                let url_name = getCat_id[0].url_name;
                let category_type_id = getCat_id[0].category_type_id;
                let sql = "SELECT * FROM products where status=1 and cat_id='"+catId+"' and product_type_id='"+category_type_id+"'";
                // console.log(category_type_id); return;
                let query = db.query(sql, function(error, result){
                    if(error) throw new Error('products table Data Problem');
                    var prodsQuery = '';
                    if(category_type_id == 1){
                        if(typeof page == 'undefined'){
                            prodsQuery = "SELECT * FROM `products` where `status`=1 and `cat_id`='"+catId+"' limit "+perPage+" ";
                        } else {
                            var offset = parseInt((page - 1)) * parseInt(perPage);
                            prodsQuery = "SELECT * FROM `products` where `status`=1 and `cat_id`='"+catId+"' limit "+perPage+" OFFSET "+offset;
                        }
                    } else if(category_type_id == 2){
                        if(typeof page == 'undefined'){
                            prodsQuery = "SELECT p.`id`,p.`cat_id`,p.`product_type_id`,p.`name`,p.`price`,p.`discount`,p.`delivery_charge`,p.`sku`,p.`description`,p.`image`,p.`slug`,p.`status`,p.`unit`,p.`grocery_category`,p.`grocery_sub_category`, pi.`grocery_image` as `groceryImage`, pv.`unit_price` as `groceryPrice`, pv.`unit_discount` as `groceryDiscount`, pv.`inventory` as `groceryQuantity`, pv.`unit_weight` as groceryWeight FROM `products` p INNER JOIN `products_images` pi ON `pi`.product_id = `p`.id INNER JOIN `product_variables` pv ON `pv`.product_id = `p`.id and p.`cat_id`='"+catId+"' GROUP by p.`name` limit "+perPage+"";
                        } else {
                            var offset = parseInt((page - 1)) * parseInt(perPage);
                            prodsQuery = "SELECT p.`id`,p.`cat_id`,p.`product_type_id`,p.`name`,p.`price`,p.`discount`,p.`delivery_charge`,p.`sku`,p.`description`,p.`image`,p.`slug`,p.`status`,p.`unit`,p.`grocery_category`,p.`grocery_sub_category`, pi.`grocery_image` as `groceryImage`, pv.`unit_price` as `groceryPrice`, pv.`unit_discount` as `groceryDiscount`, pv.`inventory` as `groceryQuantity`, pv.`unit_weight` as groceryWeight FROM `products` p INNER JOIN `products_images` pi ON `pi`.product_id = `p`.id INNER JOIN `product_variables` pv ON `pv`.product_id = `p`.id and p.`cat_id`='"+catId+"' GROUP by p.`name` limit "+perPage+" OFFSET "+offset;
                        }
                    } else {
                            prodsQuery = "";
                    }
                     
                    var query = db.query(prodsQuery, function(error, results, fields){
                    var qw = result.length;
                    var jsonResult = {
                        'products_page_count':results.length,
                        'current':page,
                        'products':results,
                        'pages' : Math.ceil(qw/perPage),
                    }

                    var myJsonString = JSON.parse(JSON.stringify(jsonResult));
                    let tblCategory = '';
                    if(category_type_id == 1){
                        tblCategory = 'books_category';
                    } else if(category_type_id == 2){
                        tblCategory = 'grocery_category';
                    }

                    let sql2 = "SELECT * from "+tblCategory+" where id='"+catId+"' and status=1";
                    let query = db.query(sql2, function(error, getmeta){
                        if(error) throw new Error(tblCategory+' Table Problem');
                        var sql_plan = "SELECT MAX(plan_price) as MaxPlanPrice FROM plans";
                        var query = db.query(sql_plan, function(error, maxplan){
                            if(error) throw new Error('plans Table Problem')
                            var allcat = "SELECT * from "+tblCategory+" where status=1 order by name;"
                            var query = db.query(allcat,function(error,getcategory){
                                if(error) throw new Error(tblCategory+' table problem');
                                    if(category_type_id == 1){
                                        res.render('front/productbycategory',{getmeta: getmeta[0],categorylist: getcategory, productlist: result, maxplan:maxplan,get_url_name:url_name,myJsonString:myJsonString});    
                                    } else {
                                        let sql_grocery_category = "SELECT * FROM grocery_category where status=1";
                                        let query_grocery_category = db.query(sql_grocery_category,function(error,getcategory){
                                            if(error) throw new Error('Grocery category products fetch error.');
                                            res.render('grocery/g_page',{'title':'Grocery Home Page','categorylist': getcategory, 'products': results, maxplan, myJsonString, get_url_name: '',base64:base64,getmeta: getmeta[0]});
                                        })
                                    }
                                });
                            });
                        });
                    });
                });
            } else {
                res.redirect("/error_page");
            }
        });
    
    }catch(error){
        console.log(error);
    }
}

// let cryptoStr = require('../routes/crypto');
const { encrypt, decrypt } = require("./crypto");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");
var base64 = require("base-64");

function requireLogin(req, res, next) {
  if (!req.user) {
    res.redirect("/signup");
  } else {
    next();
  }
}

/*exports.viewProduct = function(req, res, next){
    let title = 'Rent/Buy Online Books on Book Store - Save Up to 90% on Textbooks';
    let Ids = req.params.id;
    let sql1 = "Select * from books_category where is_deleted=0";
    let query = db.query(sql1, function(err, category) {
    let sql2 = "SELECT p.*, c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.is_deleted=0 and p.id='"+Ids+"'";
    var query = db.query(sql2, function(error, result) {
        if(error) throw new Error('failed to connect category');
            var sql = "SELECT * FROM products WHERE status='1' order by id desc limit 10 ";
            var query = db.query(sql, function(error, get_products){
                if(error) throw new Error('failed to connect products');
                var sql_plan = "SELECT MAX(plan_price) as MaxPlanPrice FROM plans";
                var query = db.query(sql_plan, function(error, maxplan){
                    if(error) throw new Error('failed to connect Max Plan');
                    var userId = req.session.userId;
                        if(userId){
                            let sql = "SELECT mobile,email FROM users WHERE id='"+userId+"'";
                            let query = db.query(sql, function(error, usersdata){
                                if(error) throw new Error('USER TABLE PROBLEM');
                                res.render('front/productview', {get_products:get_products,maxplan:maxplan,'viewlist': result[0],'title':title,'categorylist': category,message:req.flash('message'),csrfToken: req.csrfToken(),cryptr:cryptr,usersdata:usersdata[0]});
                            })
                        } else {
                            res.render('front/productview', {get_products:get_products,maxplan:maxplan,'viewlist': result[0],'title':title,'categorylist': category,message:req.flash('message'),csrfToken: req.csrfToken(),cryptr:cryptr,usersdata:''});
                        }
                });
            });
        });
    });
};*/

exports.viewProduct = function (req, res, next) {
  let title = "Rent/Buy Online Books on Book Store";
  let Ids = req.params.id;

  if (Ids != "") {
    let sql1 = "SELECT * FROM `books_category` where `is_deleted`=0";
    let query = db.query(sql1, function (error, category) {
      if (error) new Error("Product view page");
      let sql2 =
        "SELECT p.*, c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.`status`=1 and p.`product_type_id`=1 and p.id='" +
        Ids +
        "'";
      var query = db.query(sql2, function (error, result) {
        if (error) throw new Error("failed to connect category");
        var getsetting = "SELECT * FROM `settings` WHERE id='2'";
        var query = db.query(getsetting, function (error, settingData) {
          if (error) throw new Error("SETTING TABLE DATA PROBLEM");
          var sql =
            "SELECT * FROM `products` WHERE `status`=1 and `product_type_id`=1 order by `id` desc limit 10 ";
          var query = db.query(sql, function (error, get_products) {
            if (error) throw new Error("failed to connect products");
            var sql_plan = "SELECT MAX(plan_price) as MaxPlanPrice FROM plans";
            var query = db.query(sql_plan, function (error, maxplan) {
              if (error) throw new Error("failed to connect Max Plan");
              var userId = req.session.userId;
              //if(userId == null){
              let sql3 =
                "SELECT * FROM `products` WHERE `status`=1 and `product_type_id`=1 and id='" +
                Ids +
                "'";
              db.query(sql3, function (error, result) {
                if (error) throw new Error("failed to connect products tbl");
                if (result.length > 0) {
                  let meteTitle = result[0].meta_title;
                  let metaDescription = result[0].meta_description;
                  let description = result[0].description;

                  if (meteTitle === null || meteTitle == "") {
                    var M_title = result[0].name;
                  } else {
                    var M_title = meteTitle;
                  }

                  if (metaDescription === null || metaDescription == "") {
                    var M_description = result[0].description;
                  } else if (metaDescription != "") {
                    var M_description = metaDescription;
                  } else {
                    var M_description = result[0].name;
                  }

                  res.render("front/productview", {
                    getCartData: "",
                    get_products: get_products,
                    maxplan: maxplan,
                    viewlist: result[0],
                    title: title,
                    categorylist: category,
                    message: req.flash("message"),
                    csrfToken: req.csrfToken(),
                    cryptr: cryptr,
                    usersdata: "",
                    data: "",
                    settingData: settingData[0],
                    M_title,
                    M_description,
                  });
                } else {
                  res.redirect("/");
                }
              });
              /* } else {
                            var sql = "SELECT count(*) as totalrecord, p.user_id,p.name,p.email,p.mobile,p.message,c.name as categoryname from preorder_products p LEFT JOIN products c ON c.id=p.product_id where p.user_id='"+req.session.userId+"'";
                            let query = db.query(sql, function(error, usersdata){
                                if(error) throw new Error('USER TABLE PROBLEM');
                                var sql = "SELECT name,mobile,email FROM `users` WHERE id='"+userId+"'";
                                var query = db.query(sql,function(error,data){
                                    var sql3 = "SELECT * FROM `products` WHERE `status`=1 and `product_type_id`=1 and id='"+Ids+"'";
                                    db.query(sql3, function(error, getresult) {
                                        let meteTitle = getresult[0].meta_title;
                                        let metaDescription = getresult[0].meta_description;
                                        let description = getresult[0].description;

                                        if(meteTitle==null){
                                            var M_title = getresult[0].name;
                                        } else {
                                            var M_title = meteTitle;
                                        }

                                        if(metaDescription==null){
                                            var M_description = getresult[0].description;
                                        } else if(metaDescription!="") {
                                            var M_description = metaDescription;
                                        } else {
                                            var M_description = getresult[0].name;
                                        }

                                    res.render('front/productview', {get_products:get_products,maxplan:maxplan,'viewlist': result[0],'title':title,'categorylist': category,message:req.flash('message'),csrfToken: req.csrfToken(),cryptr:cryptr,usersdata:usersdata[0],data:data[0],settingData:settingData[0],M_title,M_description});
                                    });
                                });
                            });
                        }*/
            });
          });
        });
      });
    });
  }
};

exports.getCategoriesxml = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT cat_id, url_name FROM category_url WHERE status = 1",
      (err, categories) => {
        if (err) return reject(err);
        resolve(categories);
      }
    );
  });
};

exports.getProductsByCategory = (cat_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT url FROM products WHERE is_deleted = 0 AND cat_id = ?",
      [cat_id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results.map((r) => r.url)); // Extract URLs
      }
    );
  });
};

exports.allProducts = (req, res, next) => {
  try {
    var perPage = 12;
    var page = req.query.page;

    var prodsQuery = "";
    if (typeof page == "undefined") {
      prodsQuery =
        "SELECT * FROM products where status=1 and product_type_id=1 order by id desc limit " +
        perPage +
        " ";
    } else {
      var offset = parseInt(page - 1) * parseInt(perPage);
      prodsQuery =
        "SELECT * FROM products where status=1 and product_type_id=1 order by id desc limit " +
        perPage +
        " OFFSET " +
        offset;
    }

    let title = "Rent/Buy Online Books on Book Store";
    //console.log(prodsQuery);
    var query = db.query(prodsQuery, function (error, results, fields) {
      if (error) throw error;
      let total_product =
        "SELECT * FROM products where status=1 and product_type_id=1";
      db.query(total_product, function (error, total_count) {
        if (error) throw new Error("products tbl data error");

        var qw = total_count.length;
        var jsonResult = {
          products_page_count: results.length,
          current: page,
          products: results,
          pages: Math.ceil(qw / perPage),
        };

        var myJsonString = JSON.parse(JSON.stringify(jsonResult));
        var sql_plan = "SELECT MAX(plan_price) as MaxPlanPrice FROM plans";
        var query = db.query(sql_plan, function (error, maxplan) {
          if (error) throw error;
          res.render("front/products", {
            title: title,
            maxplan: maxplan,
            getcartdata: "",
            myJsonString: myJsonString,
            page,
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};
/*exports.allProducts = (req, res, next) => {
    let title = 'Rent/Buy Online Books on Book Store - Save Up to 90% on Textbooks';
    let SQL = "SELECT * FROM products where status='1' order by id desc";
    var query = db.query(SQL, function(error, results){
        if(error) throw error;
        var sql_plan = "SELECT MAX(plan_price) as MaxPlanPrice FROM plans";
            var query = db.query(sql_plan, function(error, maxplan){
                if(error) throw error;
                res.render('front/products',{title:title,results:results,maxplan:maxplan,getcartdata:'',myJsonString:''});
            });
    });
}*/

exports.checkPinNumber = function (req, res) {
  var val = req.query.pincode;
  console.log(val);
};

exports.membershipPlan = (req, res) => {
  req.session.productId = req.query.productId;
  let title = "Rental book membership plan";
  let sql = "SELECT * FROM books_category where is_deleted=0";
  let query = db.query(sql, function (err, result) {
    let sql2 = "SELECT * FROM plans where is_deleted=0";
    var query = db.query(sql2, function (err, getplans) {
      if (err) throw err;
      var sql_product_name =
        "SELECT `name` FROM `products` WHERE id='" +
        req.session.productId +
        "'";
      var query = db.query(sql_product_name, function (error, results) {
        if (error) throw error;
        var get_rand_pro =
          "SELECT p.id,p.name,p.description,p.price,p.discount,p.image,p.isbn,p.status,p.author,p.book_edition,p.slug,c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.status='1' ORDER BY rand() limit 10";
        var query = db.query(get_rand_pro, function (error, get_most_view) {
          if (error) throw error;
          let hot_pro =
            "SELECT `id`,`name`,`description`,`price`,`discount`,`image`,`status`,`slug` FROM `products` WHERE `status`='1' and discount >= 50 ORDER BY id desc limit 10";
          //console.log(hot_pro);
          db.query(hot_pro, function (error, get_get_hot_pro) {
            if (error) throw new Error("Hot Products not found");
            var sql_plan = "SELECT MAX(plan_price) as MaxPlanPrice FROM plans";
            var query = db.query(sql_plan, function (error, maxplan) {
              if (results.length > 0) {
                res.render("front/membership", {
                  cryptr: cryptr,
                  maxplan: maxplan,
                  get_most_view: get_most_view,
                  getplans: getplans,
                  title: title,
                  categorylist: result,
                  product_name: results[0].name,
                  csrfToken: req.csrfToken(),
                  get_get_hot_pro: get_get_hot_pro,
                });
              } else {
                res.render("front/membership", {
                  cryptr: cryptr,
                  maxplan: maxplan,
                  get_most_view: get_most_view,
                  getplans: getplans,
                  title: title,
                  categorylist: result,
                  csrfToken: req.csrfToken(),
                  product_name: "",
                  get_get_hot_pro: get_get_hot_pro,
                });
              }
            });
          });
        });
      });
    });
  });
};

/*exports.getCategories = (req,res,next)=>{
    var qs = req.query;
    if(req.params.id){
        let sqls = "SELECT `cat_id`,url_name FROM category_url WHERE url_name = '"+req.params.id+"'";
        var query = db.query(sqls, function(error,getCat_id){
            if(error) throw new Error('category url not found in category_url table');
            let catId = getCat_id[0].cat_id;
            let url_name = getCat_id[0].url_name;
            let sql = "SELECT * FROM products where is_deleted=0 and cat_id='"+catId+"'";
            let query = db.query(sql, function(err, result){
                let sql2 = "SELECT * from books_category where id='"+catId+"' and is_deleted=0";
                let query = db.query(sql2, function(error, getmeta){
                    var sql_plan = "SELECT MAX(plan_price) as MaxPlanPrice FROM plans";
                        var query = db.query(sql_plan, function(error, maxplan){
                            var allcat = "SELECT * from books_category where is_deleted=0;"
                            var query = db.query(allcat,function(error,getcategory){
                                res.render('front/productbycategory',{getmeta: getmeta[0],categorylist: getcategory, productlist: result, maxplan:maxplan,get_url_name:url_name});
                            });
                        });
                });
            });
        });
    };
};*/

exports.getCategories = (req, res, next) => {
  var qs = req.query;
  let sql =
    "SELECT * FROM products where is_deleted=0 and cat_id='" + qs.cat_id + "'";
  let query = db.query(sql, function (err, result) {
    let sql2 = "SELECT * from books_category where is_deleted=0";
    let query = db.query(sql2, function (error, getcategory) {
      var sql_plan = "SELECT MAX(plan_price) as MaxPlanPrice FROM plans";
      var query = db.query(sql_plan, function (error, maxplan) {
        res.render("front/productbycategory", {
          categorylist: getcategory,
          productlist: result,
          maxplan: maxplan,
          cat_name: qs.cat_name,
        });
      });
    });
  });
};

exports.updateCart = (req, res, next) => {
  try {
    var userId = req.session.userId;
    var cartId = req.query.cartId;
    var productId = req.query.productId.split(",");
    var get_quantity = req.query.quantity.split(",");

    var msg_error = new Array();

    for (let i = 1; i <= productId.length; i++) {
      var status = 0;
      let getQty = 0;

      if (productId[i - 1] && get_quantity[i - 1]) {
        var productQnty =
          "SELECT name as p_name,quantity FROM `products` WHERE `id` = '" +
          productId[i - 1] +
          "' and `status`='1'";
        var product_name = "";

        var query = db.query(productQnty, function (error, getgetQty) {
          if (error) throw new Error("failed to connect name & quantity");
          getQty = getgetQty[0].quantity;
          product_name = getgetQty[0].p_name;

          if (getQty >= get_quantity[i - 1]) {
            var updatecart12 =
              "UPDATE `cart_product`, `cart` SET `quantity`='" +
              get_quantity[i - 1] +
              "' WHERE `cart_product`.product_id='" +
              productId[i - 1] +
              "' and `cart_product`.`cart_id`=`cart`.`cart_id` and `cart`.status='0' and `cart`.user_id = '" +
              userId +
              "' ";
            var query = db.query(updatecart12, function (error, updatecarts) {
              if (error) throw new Error("failed to connect updateed cart");
              // if (!error && res.statusCode == 200) {
              //     res.send('1');
              // }
            });
            //console.log(2);
          } else {
            //console.log(1);
            var msg =
              "only " +
              getQty +
              " books available for " +
              product_name +
              " this";
            //console.log(msg);
            msg_error.push(msg);
            //console.log(msg_error);
            //var array1 = ["kishor"];
            //msg_error.push(array1);
            status = 1;
          }
        });
      } else {
        console.log("ERROR11111!.");
      }
    }
    console.log("done", msg_error);
    return;
    //return {'status':status, 'msg_error':msg_error};
  } catch (error) {
    console.log(error.message);
  }
};

exports.cartAdd = function (req, res) {
  var message = "";
  var user = req.session.user,
    userId = req.session.userId;
  if (userId == null) {
    res.redirect("/sign-in");
  } else {
    /*let get_cart = "SELECT `cart_product`.quantity, SUM(cart_product.quantity) as cartquantity, `products`.id as productId, `products`.name, `products`.price, `cart_product`.on_rental,`products`.quantity, `products`.image, `products`.status, `products`.discount, `products`.slug, `cart_product`.cart_id, `cart_product`.product_id, `cart_product`.quantity,  `cart`.cart_id as CartId,`cart`.user_id,`cart`.status FROM `products` LEFT JOIN `cart_product` ON `products`.id = `cart_product`.product_id LEFT JOIN `cart` ON `cart_product`.cart_id = `cart`.cart_id where `cart`.status='0' and `cart`.user_id = '"+userId+"' GROUP BY `cart_product`.product_id";*/
    let get_cart =
      "SELECT `cart_product`.quantity, SUM(cart_product.quantity) as cartquantity, `products`.id as productId, `products`.product_type_id as productType, `products`.name, `products`.price, `cart_product`.on_rental,`products`.quantity, `products`.quantity as actualQuantity, `products`.image, `products`.status, `products`.discount, `products`.slug, `cart_product`.cart_id, `cart_product`.product_id, `cart_product`.quantity,  `cart`.cart_id as CartId,`cart`.user_id,`cart`.status, `products_images`.grocery_image as groceyImg,`product_variables`.unit_price as groceyProductPrice, `product_variables`.unit_discount as unitDiscount FROM `products` LEFT JOIN `cart_product` ON `products`.id = `cart_product`.product_id LEFT JOIN `cart` ON `cart_product`.cart_id = `cart`.cart_id LEFT JOIN `products_images` ON `products`.id = `products_images`.product_id  LEFT JOIN `product_variables` ON `products`.id = `product_variables`.product_id where `cart`.status='0' and `cart`.user_id = '" +
      userId +
      "' GROUP BY `cart_product`.product_id";

    // console.log(get_cart);
    var query = db.query(get_cart, function (err, getcartdata) {
      if (err) throw err;
      // res.render("shoppingcart/addtocart", { getcartdata: getcartdata, message: req.flash("message"), errors: req.flash("errors"), base64 });
      res.render("shoppingcart/addtocart", {
        getcartdata: getcartdata,
        message: req.flash("message")[0] || "", // Get the first message or empty string
        errors: req.flash("errors")[0] || "",
        base64,
      });
    });
  }
};

exports.preOrderProduct = (req, res, next) => {
  if (req.method == "POST") {
    var userId = req.session.userId;
    if (userId == null) {
      res.redirect("/sign-in");
    } else {
      let today = new Date().toISOString().slice(0, 19).replace("T", " ");
      var post = req.body;
      var product_slug = cryptr.decrypt(post.product_slug);
      //let username = post.username;
      //let userphone = post.userphone;
      let message = post.message;

      /* if(!username){
                res.status(200).json({ message: 'Username cannot be empty'}); 
                return;
            }
            if(!userphone){
                res.status(200).json({ message: 'Mobile cannot be empty'}); 
                return;
            }*/
      if (!message) {
        res.status(200).json({ message: "Message cannot be empty" });
        return;
      }
      let userdata =
        "SELECT name,mobile,email from `users` WHERE id='" + userId + "'";
      //console.log(userdata); return;
      let dataquery = db.query(userdata, function (error, getdata) {
        if (error) throw new Error("Data Problems");
        let username = getdata[0].name;
        let usermobile = getdata[0].mobile;
        let useremail = getdata[0].email;
        let product_id = cryptr.decrypt(post.product_id);
        let sql =
          "INSERT INTO `preorder_products` (product_id,user_id,name,email,mobile,message,created_at) VALUES('" +
          product_id +
          "','" +
          userId +
          "','" +
          username +
          "','" +
          useremail +
          "','" +
          usermobile +
          "','" +
          message +
          "','" +
          today +
          "')";

        let query = db.query(sql, function (error, preorder) {
          if (error) throw new Error("Pre-order insert problem");
          let update_product =
            "UPDATE `products` SET pre_order_status='1' WHERE id='" +
            product_id +
            "'";
          let querys = db.query(
            update_product,
            function (error, updateproductstbl) {
              if (error)
                throw new Error("pre order status not updated in products tbl");
              req.flash(
                "message",
                "Your pre-order request has been sent to admin they will call back soon."
              );
              res.redirect(product_slug + "/" + product_id);
            }
          );
        });
      });
    }
  }
};

exports.saveAddtoCart = function (req, res, next) {
  if (req.method == "POST") {
    var user = req.session.user,
      userId = req.session.userId;

    var today = new Date().toISOString().slice(0, 19).replace("T", " ");
    if (userId == null) {
      req.session.addToCart = {
        quantity: req.body.quantity,
        product_id: req.body.product_id,
      };

      var SQL = "SELECT * FROM `products` WHERE id = " + req.body.product_id;

      db.query(SQL, function (err, results) {
        var product_id = results[0]["id"];
        var name = results[0]["name"];
        var image = results[0]["image"];
        var price = results[0]["price"];
        var discount = results[0]["discount"];
        price =
          parseFloat(price) - (parseFloat(price) * parseFloat(discount)) / 100;
        res.redirect(
          "/sign-in?product_id=" +
            product_id +
            "&quantity=" +
            req.body.quantity +
            "&name=" +
            name +
            "&image=" +
            image +
            "&price=" +
            price
        );
      });
    } else {
      var post = req.body;
      var quantity = post.quantity;
      var product_id = post.product_id;
      //console.log(quantity+'==='+product_id);
      var SQL =
        "SELECT * FROM `cart` WHERE user_id = '" + userId + "' and status='0'";

      var query = db.query(SQL, function (err, results) {
        //console.log(results); return;
        if (results.length == 1) {
          var cart_update =
            "SELECT * from cart_product WHERE cart_id='" +
            results[0].cart_id +
            "' and product_id='" +
            product_id +
            "'";
          // console.log(cart_update); return;
          var query = db.query(cart_update, function (err, cart_update) {
            if (cart_update.length == 1) {
              //console.log(cart_update[0].quantity); return;
              var new_quantity =
                parseInt(cart_update[0].quantity) + parseInt(quantity);
              //console.log(cart_update[0].quantity);
              //console.log(new_quantity); return;
              var cats_product =
                "UPDATE `cart_product` SET quantity='" +
                new_quantity +
                "' WHERE id='" +
                cart_update[0].id +
                "'";

              //console.log(cats_product); return;

              var query = db.query(cats_product, function (error, cartresult) {
                if (error) {
                  console.log(error);
                } else {
                  res.redirect("addtocart");
                }
              });
            } else {
              let cart_product =
                "INSERT INTO `cart_product`(cart_id,product_id,quantity,created_at,updated_at) VALUES('" +
                results[0].cart_id +
                "','" +
                product_id +
                "','" +
                quantity +
                "','" +
                today +
                "','" +
                today +
                "')";
              var query = db.query(cart_product, function (err, insertedcart) {
                res.redirect("addtocart");
              });
            }
          });
        } else {
          let cart_insert =
            "INSERT INTO `cart`(user_id,status,created_at,updated_at) VALUES('" +
            userId +
            "','" +
            0 +
            "','" +
            today +
            "','" +
            today +
            "')";
          var query = db.query(cart_insert, function (err, result) {
            let cart_product =
              "INSERT INTO `cart_product`(cart_id,product_id,quantity,created_at,updated_at) VALUES('" +
              result.insertId +
              "','" +
              product_id +
              "','" +
              quantity +
              "','" +
              today +
              "','" +
              today +
              "')";
            var query = db.query(cart_product, function (err, insertedcart) {
              res.redirect("addtocart");
            });
          });
        }
      });
    }
  }
};

exports.aboutPage = function (req, res) {
  let title = "About us";
  let sql = "SELECT * FROM books_category where is_deleted=0";
  let query = db.query(sql, function (err, result) {
    res.render("front/aboutus", { title: title, categorylist: result });
  });
};
exports.categoryPage = function (req, res) {
  let title = "categories";
  let sql = "SELECT * FROM books_category where is_deleted=0";
  let query = db.query(sql, function (err, result) {
    res.render("front/categories", { title: title, categorylist: result });
  });
};
exports.contactPage = function (req, res) {
  let title = "Contact";
  let sql = "SELECT * FROM books_category where is_deleted=0";
  let query = db.query(sql, function (err, result) {
    res.render("front/contact", { title: title, categorylist: result });
  });
};

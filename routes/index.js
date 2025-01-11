/*
 * GET home page.
 */
const { encrypt, decrypt } = require("./crypto");
const { addtocart } = require("./cart");
exports.landingpage = function (req, res) {
    let title = "Online Book Store | Buy Books Online | Order Books Online";
    //var sql1="Select * from books_category where is_deleted=0 order by name";
    //var sql1 ="SELECT * FROM `books_category` where parents_id='0' and `status`='1' order by name limit 10";
    var sql1 =
        "SELECT `books_category`.id,`books_category`.name,`books_category`.meta_title,`books_category`.meta_description,`books_category`.meta_canonical_tag,`products`.`cat_id`,count(*) as `pro_count` FROM `products` left join `books_category` on `books_category`.id = `products`.cat_id where `products`.cat_id!='0' and `books_category`.id!='' group by `products`.cat_id having pro_count > 10 order by name limit 10";

    var query = db.query(sql1, function (error, result) {
        var sql2 =
            "SELECT p.id,p.name,p.description,p.price,p.discount,p.image,p.isbn,p.status,p.author,p.book_edition,p.slug,c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.status=1 and p.product_type_id=1 order by rand() limit 10";
        var query = db.query(sql2, function (error, result1) {
            if (error) throw error;
            let sql3 = "SELECT * FROM home_slider where status=1";
            var query = db.query(sql3, function (error, getSlider) {
                if (error) throw error;
                var sql_plan = "SELECT MAX(plan_price) as MaxPlanPrice FROM plans";
                var query = db.query(sql_plan, function (error, maxplan) {
                    if (error) throw error;
                    var get_feature_pro =
                        "SELECT p.id,p.name,p.description,p.price,p.discount,p.image,p.isbn,p.status,p.author,p.book_edition,p.slug,c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.product_type=2 and p.status=1 and p.product_type_id=1 ORDER BY p.updated_at desc limit 10";
                    var query = db.query(get_feature_pro, function (error, feature_product) {
                        if (error) throw error;
                        var get_rand_pro =
                            "SELECT p.id,p.name,p.description,p.price,p.discount,p.image,p.isbn,p.status,p.author,p.book_edition,p.slug,c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.product_type=5 and p.status=1 and p.product_type_id=1 ORDER BY p.updated_at desc limit 10";
                        var query = db.query(get_rand_pro, function (error, random_product) {
                            if (error) throw error;
                            var hotdeal =
                                "SELECT p.id,p.name,p.description,p.price,p.discount,p.image,p.isbn,p.status,p.author,p.book_edition,p.slug,p.product_type,c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.product_type='1' and p.status=1 and p.product_type_id=1 ORDER BY p.updated_at desc limit 10";
                            var query = db.query(hotdeal, function (error, gethotdeal) {
                                if (error) throw error;
                                var special_offer =
                                    "SELECT p.id,p.name,p.description,p.price,p.discount,p.image,p.isbn,p.status,p.author,p.book_edition,p.slug,p.product_type,c.name as categoryname from `products` p left join `books_category` c on c.id=p.cat_id where p.product_type=7 and p.`status`=1 and p.`product_type_id`=1 ORDER BY p.updated_at desc";
                                var query = db.query(special_offer, function (error, special_product) {
                                    if (error) throw new Error("special_product not found");
                                    console.log("Good to go");
                                    res.render("front/landing_page", {
                                        categorylist: result,
                                        title: title,
                                        productlist: result1,
                                        feature_product: feature_product,
                                        random_product: random_product,
                                        special_product: special_product,
                                        gethotdeal: gethotdeal,
                                        getSlider: getSlider,
                                        encrypt: encrypt,
                                        addtocart: addtocart,
                                        maxplan: maxplan,
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

exports.admin = function (req, res) {
    res.render("admin/admin", {
        message: req.flash("message"),
        message_success: req.flash("message_success"),
    });
};

exports.indexpage = function (req, res) {
    var message = "";
    res.render("admin/admin", { message: message, message_success: "" });
};

exports.logincheck = function (req, res) {
    var user = req.session.user,
        userId = req.session.userId,
        type = req.session.type;
    if (userId == null) {
        res.redirect("/admin");
        return;
    } else {
        res.render("profile.ejs");
    }
};

exports.authGaurd = function (req, res, next) {
    const userId = req.session.userId;
    if (userId == null) {
        res.redirect("/admin");
        return;
    }
    next();
};

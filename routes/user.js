var bcrypt = require("bcryptjs");
var xss = require("xss");
var nodemailer = require("nodemailer");
require("dotenv").config();

const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({
    accessKeyId: process.env.AccessKey,
    secretAccessKey: process.env.SecretKey,
    region: process.env.Region,
});
const s3 = new AWS.S3();
exports.login = function (req, res) {
    var message = "";
    var sess = req.session;
    if (req.method == "POST") {
        var post = req.body;
        var email = post.user_name;
        var pass = post.password;
        var sql =
            "SELECT `id`, `name`, `type`, `password` FROM `users` WHERE `email`='" +
            email +
            "' and status='0' and (`type`='1' || `type`='2' || `type`='3' || `type`='5') ";
        db.query(sql, function (err, results) {
            if (results.length > 0) {
                bcrypt.compare(pass, results[0].password, function (err, ress) {
                    if (ress) {
                        req.session.userId = results[0].id;
                        req.session.type = results[0].type;
                        req.session.user = results[0];

                        var user = req.session.user,
                            userId = req.session.userId,
                            type = req.session.type;
                        if (userId == null) {
                            res.redirect("/admin");
                            return;
                        } else {
                            res.redirect("/dashboard");
                        }
                    } else {
                        req.flash("message", "Enter valid password");
                        res.redirect("/admin");
                    }
                });
            } else {
                req.flash("message", "Wrong Credentials");
                res.redirect("/admin");
            }
        });
    } else {
        req.flash("message", "Internal server error 500");
        res.redirect("/admin");
    }
};

exports.signup = function (req, res) {
    message = "";
    var bcrypt = require("bcryptjs");
    if (req.method == "POST") {
        var post = req.body;
        var name = post.first_name;
        var email = post.user_name;
        var pass = post.password;
        var hash = bcrypt.hashSync(pass, 10);
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var sql = "select * from users where email='" + email + "' ";
        var query = db.query(sql, function (err, result) {
            if (result.length > 0) {
                message = "User Already Registered";
                res.render("signup.ejs", { message: message });
            } else {
                var sql1 =
                    "INSERT INTO `users`(`name`,`email`, `password`,createdby,modifiedby) VALUES ('" +
                    name +
                    "', '" +
                    email +
                    "', '" +
                    hash +
                    "','" +
                    today +
                    "','" +
                    today +
                    "')";
                var query = db.query(sql1, function (err, result) {
                    message = "Succesfully! Your account has been created.";
                    res.render("signup.ejs", { message: message });
                });
            }
        });
    } else {
        res.render("signup.ejs");
    }
};

exports.dashboard = function (req, res, next) {
    var user = req.session.user,
        userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
    db.query(sql, function (err, results) {
        res.render("profile.ejs", { user: user });
    });
};

exports.logout = function (req, res) {
    var message = "";
    req.session.destroy(function (err) {
        if (err) {
            throw error;
        } else {
            res.render("admin/admin", { message: message, message_success: "" });
        }
    });
};

exports.productpage = function (req, res) {
    var user = req.session.user,
        userId = req.session.userId;
    const page = req.query.page || 1;
    const count = req.query.count || 25;
    const limit_start = count;
    const limit_end = (page - 1) * count;
    var sql1 = "Select * from books_category where is_deleted=0";
    var query = db.query(sql1, function (err, result) {
        if (userId == null) {
            res.redirect("/admin");
        } else {
            let countQuery = "";

            let newkey = req.query.search + "";
            if (req.session.type == 1) {
                if (req.query.search) {
                    var sql2 =
                        "SELECT p.*,c.name as categoryname from products p left join books_category c on c.id=p.cat_id WHERE p.status=1 and (p.name LIKE '%" +
                        req.query.search +
                        "%' or `isbn13` ='"+req.query.search+"' or `isbn` ='"+req.query.search+"' or `publisher` LIKE '%"+req.query.search+"%' or `author` LIKE '%"+req.query.search+"%' or `description` LIKE '%"+req.query.search+"%') and product_type_id=1 ORDER BY id DESC LIMIT " +
                        limit_start +
                        " OFFSET " +
                        limit_end;
                    countQuery =
                        "SELECT count(*) as count from products p left join books_category c on c.id=p.cat_id where p.status=1 and product_type_id=1  and (p.name LIKE '%" +
                        req.query.search +
                        "%' ) order by c.id desc  ";
                } else {
                    var sql2 =
                        "SELECT p.*,c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.status=1 and product_type_id=1 order by id desc LIMIT " +
                        limit_start +
                        " OFFSET " +
                        limit_end;
                    countQuery =
                        "SELECT count(*) as count from products p left join books_category c on c.id=p.cat_id where p.status=1 and product_type_id=1 order by c.id desc  ";
                }
            } else if (req.session.type == 2) {
                var sql2 =
                    "SELECT p.*,c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.status=1 and product_type_id=1 and `user_id`!='0' and p.user_id='" +
                    userId +
                    "'  order by p.id desc LIMIT " +
                    limit_start +
                    " OFFSET " +
                    limit_end;
                countQuery =
                    "SELECT count(*) as coun from products p left join books_category c on c.id=p.cat_id where p.status=1 and product_type_id=1 and `user_id`!='0' and p.user_id='" +
                    userId +
                    "'  order by p.id desc ";
            } else if (req.session.type == 5) {
                var sql2 =
                    "SELECT p.*,c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.status=1 and product_type_id=1 and `user_id`!='0' order by id desc LIMIT " +
                    limit_start +
                    " OFFSET " +
                    limit_end;
                countQuery =
                    "SELECT count(*) as count from products p left join books_category c on c.id=p.cat_id where p.status=1 and product_type_id=1 and `user_id`!='0' order by c.id desc ";
            } else {
                var sql2 =
                    "SELECT p.*,c.name as categoryname from products p left join books_category c on c.id=p.cat_id where p.status=1 and product_type_id=1 and `user_id`='" +
                    userId +
                    "' and `user_id`!='0' order by p.id desc LIMIT " +
                    limit_start +
                    " OFFSET " +
                    limit_end;
                countQuery =
                    "SELECT count(*) as count from products p left join books_category c on c.id=p.cat_id where p.status=1 and product_type_id=1 and `user_id`='" +
                    userId +
                    "' and `user_id`!='0' order by p.id desc ";
            }

            db.query(sql2, function (err, result1) {
                db.query(countQuery, function (err, total) {
                    if (err) throw err;
                    let get_type = "SELECT * FROM products_type order by name";
                    const totalpages =
                        total?.[0]?.count / req.query.count > Math.ceil(total?.[0]?.count / req.query.count)
                            ? Math.ceil(total?.[0]?.count / req.query.count) + 1
                            : Math.ceil(total?.[0]?.count / req.query.count);
                    db.query(get_type, function (err, get_type_data) {
                        res.render("admin/product", {
                            categorylist: result,
                            total: total?.[0].count,
                            productlist: result1,
                            get_type_data: get_type_data,
                            message: req.flash("message"),
                            errors: req.flash("errors"),
                            query: req.query,
                            totalpages: totalpages,
                        });
                    });
                });
            });
        }
    });
};
exports.countrypage = function (req, res) {
    var user = req.session.user,
        userId = req.session.userId;
    if (userId == null) {
        res.redirect("/");
        return;
    } else {
        var sql1 = "Select * from country where is_deleted=0";
        var query = db.query(sql1, function (err, result) {
            //            var value=JSON.stringify(result);
            //            console.log(value);
            res.render("country.ejs", { countrylist: result });
        });
    }
};
exports.citypage = function (req, res) {
    var rsult2 = [];
    var sql1 = "Select * from country where is_deleted=0";
    var query = db.query(sql1, function (err, result) {
        var sql2 =
            "Select cs.* ,c.name as countryname ,s.name as statename from city cs left join country c on c.id=cs.countryid left join state s on s.id=cs.stateid where cs.is_deleted=0";
        var query = db.query(sql2, function (err, result1) {
            res.render("city.ejs", {
                countrylist: result,
                citylist: result1,
                statelist: rsult2,
            });
        });
    });
};

exports.statepage = function (req, res) {
    var data = [];
    var user = req.session.user,
        userId = req.session.userId;
    if (userId == null) {
        res.render("index.ejs");
        //        return;
    } else {
        var sql1 = "Select * from country where is_deleted=0";
        var query = db.query(sql1, function (err, result) {
            var sql2 = "Select s.* ,c.name as countryname from state s left join country c on c.id=s.countryid where s.is_deleted=0";
            var query = db.query(sql2, function (err, result1) {
                res.render("state.ejs", { countrylist: result, statelist: result1 });
            });
        });
    }
};
// Category page
exports.categorypage = function (req, res) {
    var userId = req.session.userId;
    var userType = req.session.type;
    if (userId == null && userType == null) {
        res.redirect("/admin");
    }
    let sql1 = "Select * from books_category where is_deleted=0 order by id desc";
    let query = db.query(sql1, function (error, result) {
        if (error) throw error;
        res.render("admin/category", {
            categorylist: result,
            message: req.flash("message"),
        });
    });
};
//catalog condition
exports.catalogcondition = function (req, res) {
    var userId = req.session.userId;
    var userType = req.session.type;
    if (userId == null && userType == null) {
        res.redirect("/admin");
    }
    let sql1 = "Select * from catalog_condition where is_deleted=0 order by id desc";
    let query = db.query(sql1, function (error, result) {
        if (error) throw error;
        let sql2 = db.query("Select DISTINCT publisher from products where is_deleted=0 order by id desc", function (err, ress) {
            let sql3 = db.query("Select DISTINCT author from products where is_deleted=0 order by id desc", function (err, resss) {
                let sql4 = db.query("Select DISTINCT url_name from category_url where status=1 order by id desc", function (err, cateress) {
                    let sql5 = db.query("Select DISTINCT name from catalog_info where is_deleted=0 order by id desc", function (err, catalogress) {
                        res.render("admin/catalog-condition", {
                            conditionlist: result,
                            publisher: ress,
                            category: cateress,
                            author: resss,
                            catalog: catalogress,
                            message: req.flash("message"),
                        });
                    });
                });
            });
        });
    });
};
//
//Catalog Page
exports.catalogpage = function (req, res) {
    var userId = req.session.userId;
    var userType = req.session.type;
    if (userId == null && userType == null) {
        res.redirect("/admin");
    }
    let sql1 = "Select * from catalog_info where is_deleted=0 order by id desc";
    let query = db.query(sql1, function (error, result) {
        if (error) throw error;
        let sql2 = db.query("Select DISTINCT publisher from products where is_deleted=0 order by id desc", function (err, ress) {
            let sql3 = db.query("Select DISTINCT author from products where is_deleted=0 order by id desc", function (err, resss) {
                res.render("admin/catalog", {
                    cataloglist: result,
                    publisher: ress,
                    author: resss,
                    message: req.flash("message"),
                });
            });
        });
    });
};
//cart page
exports.cartspage = function (req, res) {
    var userId = req.session.userId;
    var userType = req.session.type;
    if (userId == null && userType == null) {
        res.redirect("/admin");
    }
    let sql1 = "Select * from carts where is_deleted=0 order by id desc";
    let query = db.query(sql1, function (error, result) {
        if (error) throw error;
        res.render("admin/carts", {
            cataloglist: result,
            message: req.flash("message"),
        });
    });
};

exports.subcategorypage = function (req, res) {
    var sql1 = "Select id,name from books_category where is_deleted=0 order by id desc";
    var query = db.query(sql1, function (err, result) {
        var sql2 = "select s.* ,c.name as categoryname from books_sub_category s left join books_category c on c.id=s.categoryid where s.is_deleted=0";
        var query = db.query(sql2, function (err, result1) {
            console.log("🚀 ~ file: user.js:357 ~ query ~ err:", err);
            console.log("🚀 ~ file: user.js:357 ~ query ~ result1:", result1);
            res.render("admin/subcategory", {
                categorylist: result,
                subcategorylist: result1,
                message: req.flash("message"),
            });
        });
    });
};

exports.customerpage = (req, res, next) => {
    var sql1 = "SELECT * FROM `users` order by `id` DESC";
    let title = "User List";
    var query = db.query(sql1, function (error, result) {
        if (error) throw new Error("Table data problem");
        res.render("admin/customer", {
            customerlist: result,
            title: title,
            csrfToken: req.csrfToken(),
            message: req.flash("message"),
        });
    });
};

exports.Addcountry = function (req, res) {
    if (req.method == "POST") {
        var post = req.body;
        var Country = post.Country;
        var CountryCode = post.CountryCode;
        var ISDCode = post.ISDCode;
        var Currency = post.Currency;
        var Status = post.Status;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var sql1 =
            "INSERT INTO `country`(name,code, isd_code,status,created_on,modified_on,currency) VALUES ('" +
            Country +
            "', '" +
            CountryCode +
            "', '" +
            ISDCode +
            "','" +
            Status +
            "','" +
            today +
            "' ,'" +
            today +
            "' ,'" +
            Currency +
            "')";
        var query = db.query(sql1, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/countrypage");
            }
        });
    } else {
    }
};

exports.Editcountry = function (req, res) {
    var id = req.body.id;
    var data = "";
    var sql1 = "Select * from country where id='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.send(data);
    });
};

exports.Updatecountry = function (req, res) {
    if (req.method == "POST") {
        var post = req.body;
        var id = post.edit_country_id;
        var Country = post.Country_edit;
        var CountryCode = post.edit_code;
        var ISDCode = post.edit_isd_code;
        var Currency = post.edit_currency;
        var Status = post.edit_status;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");

        var sql1 =
            "UPDATE country set name='" +
            Country +
            "' , code='" +
            CountryCode +
            "',isd_code='" +
            ISDCode +
            "',status='" +
            Status +
            "',currency='" +
            Currency +
            "',created_on='" +
            today +
            "',modified_on='" +
            today +
            "' where id='" +
            id +
            "'";
        var query = db.query(sql1, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/countrypage");
            }
        });
    } else {
    }
};

exports.Deletecountry = function (req, res) {
    var id = req.body.id;
    var data = "";
    var sql1 = "UPDATE country set is_deleted=1  where id='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.redirect("/countrypage");
    });
};

exports.Addstate = function (req, res) {
    if (req.method == "POST") {
        var post = req.body;
        var State = post.State;
        var stateCode = post.stateCode;
        var countryid = post.country;
        var Status = post.Status;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");

        var sql1 =
            "INSERT INTO `state`(name,code, countryid,status,created_on,modeified_on) VALUES ('" +
            State +
            "', '" +
            stateCode +
            "', '" +
            countryid +
            "','" +
            Status +
            "','" +
            today +
            "' ,'" +
            today +
            "' )";
        var query = db.query(sql1, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/statepage");
            }
        });
    } else {
    }
};

exports.Editstate = function (req, res) {
    var id = req.body.id;
    var data = "";
    var sql1 = "Select s.* ,c.name as countryname from state s left join country c on c.id=s.countryid where s.id='" + id + "'";

    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.send(data);
    });
};

exports.Updatestate = function (req, res) {
    if (req.method == "POST") {
        var post = req.body;
        var id = post.edit_state_id;
        var State = post.edit_State;
        var StateCode = post.edit_stateCode;
        var Countryid = post.edit_stae_country;
        var Status = post.edit_state_Status;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");

        var sql1 =
            "UPDATE state set name='" +
            State +
            "' , code='" +
            StateCode +
            "',countryid	='" +
            Countryid +
            "',status='" +
            Status +
            "',created_on='" +
            today +
            "',modeified_on='" +
            today +
            "' where id='" +
            id +
            "'";
        var query = db.query(sql1, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/statepage");
            }
        });
    } else {
    }
};

exports.Deletestate = function (req, res) {
    var id = req.body.id;
    var data = "";
    var sql1 = "UPDATE state set is_deleted=1  where id='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.redirect("/statepage");
    });
};

exports.Countrywisestate = function (req, res) {
    var id = req.body.id;
    var sql1 = "select id,name from state where countryid='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
};

exports.Addcity = function (req, res) {
    if (req.method == "POST") {
        var post = req.body;
        var city = post.City;
        var code = post.cityCode;
        var countryid = post.city_country;
        var stateid = post.city_state;
        var Status = post.Status;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");

        var sql1 =
            "INSERT INTO `city`(name,code, countryid,stateid,status,created_on,modified_on) VALUES ('" +
            city +
            "', '" +
            code +
            "', '" +
            countryid +
            "' , '" +
            stateid +
            "' ,'" +
            Status +
            "','" +
            today +
            "' ,'" +
            today +
            "' )";
        var query = db.query(sql1, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/citypage");
            }
        });
    } else {
    }
};

exports.Editcity = function (req, res) {
    var id = req.body.id;
    var statelist = [];
    var sql1 = "Select * from city  where id='" + id + "'";

    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            var sql2 = "select id , name from state where countryid='" + result[0]["countryid"] + "'";
            var query = db.query(sql2, function (err, result1) {
                //console.log(result1);
                statelist[0] = result1;
                statelist[1] = result;
                console.log(statelist);
                res.send(statelist);
            });
        }
    });
};

exports.Updatecity = function (req, res) {
    if (req.method == "POST") {
        var post = req.body;
        var id = post.edit_city_id;
        var City = post.edit_City;
        var cityCode = post.edit_City_Code;
        var countryid = post.edit_City_Code_country;
        var stateid = post.edit_City_Code_state;
        var Status = post.edit_City_Status;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");

        var sql1 =
            "UPDATE city set name='" +
            City +
            "' , code='" +
            cityCode +
            "',countryid='" +
            countryid +
            "',stateid='" +
            stateid +
            "',status='" +
            Status +
            "',created_on='" +
            today +
            "',modified_on='" +
            today +
            "' where id='" +
            id +
            "'";
        var query = db.query(sql1, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/citypage");
            }
        });
    } else {
    }
};

exports.Deletecity = function (req, res) {
    var id = req.body.id;
    var data = "";
    var sql1 = "UPDATE city set is_deleted=1  where id='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.redirect("/citypage");
    });
};

exports.Addcustomer = (req, res) => {
    if (req.method == "POST") {
        var post = req.body;
        var name = post.user_name;
        var email = post.user_email;
        var mobile = post.user_phone;
        var status = post.user_status;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var pass = post.user_phone;
        const rounds = 10;
        var hash = bcrypt.hashSync(pass, rounds);

        if (!name) {
            res.status(200).json({ message: "Username cannot be empty" });
            return;
        }
        if (!email) {
            res.status(200).json({ message: "email cannot be empty" });
            return;
        }
        if (!mobile) {
            res.status(200).json({ message: "mobile cannot be empty" });
            return;
        }
        var sql = "SELECT email,mobile FROM `users` WHERE email='" + email + "' or mobile='" + mobile + "'";
        var query = db.query(sql, function (error, checkusers) {
            if (checkusers.length > 0) {
                req.flash("message", "User already registered with same email id or mobile");
                res.redirect("/customerpage");
            } else {
                var sql1 =
                    "INSERT INTO `users`(name, email, mobile, password, type, status,createdby,modifiedby) VALUES ('" +
                    name +
                    "', '" +
                    email +
                    "', '" +
                    mobile +
                    "', '" +
                    hash +
                    "', '0', '0', '" +
                    today +
                    "', '" +
                    today +
                    "')";
                var query = db.query(sql1, function (error, result) {
                    if (error) throw new Error("User creation problem");
                    res.redirect("/customerpage");
                });
            }
        });
    }
};

exports.Updatecustomer = function (req, res) {
    if (req.method == "POST") {
        var post = req.body;
        var id = post.edit_id;
        var name = post.edit_name;
        var email = post.edit_email;
        var mobile = post.edit_phone;
        var Status = post.edit_status;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");

        if (!name) {
            res.status(200).json({ message: "Username cannot be empty" });
            return;
        }
        if (!email) {
            res.status(200).json({ message: "email cannot be empty" });
            return;
        }
        if (!mobile) {
            res.status(200).json({ message: "mobile cannot be empty" });
            return;
        }
        var sql = "SELECT email,mobile FROM `users` WHERE email='" + email + "' or mobile='" + mobile + "'";
        var query = db.query(sql, function (error, checkusers) {
            if (checkusers.length > 1) {
                req.flash("message", "User already registered with same email id or mobile");
                res.redirect("/customerpage");
            } else {
                var sql1 =
                    "UPDATE users set `name`='" +
                    name +
                    "', `email`='" +
                    email +
                    "', `mobile`='" +
                    mobile +
                    "', `status`='" +
                    Status +
                    "', `modifiedby` ='" +
                    today +
                    "' where `id`='" +
                    id +
                    "'";
                var query = db.query(sql1, function (error, result) {
                    if (error) throw new Error("User Update Problem");
                    req.flash("message", "Customer has been successfully updated.");
                    res.redirect("/customerpage");
                });
            }
        });
    }
};

exports.Deletecustomer = function (req, res) {
    /* var id = req.body.id;
    var data = '';
    var sql1 = "DELETE FROM users WHERE id='" + id + "'";
    var query = db.query(sql1, function (error, result) {
        if (error) throw new Error('DATA TABLE ERROR');
        data = result;
        req.flash('message', 'Customer has been successfully deleted.');
        res.redirect("/customerpage");
    }); */
    res.send("ok");
    //req.flash("message", "Customer has been successfully deleted.");
    //res.redirect("/customerpage");
};

exports.Addcategory = function (req, res) {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/addcategory") {
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.category_image.path;
            var status = fields.cat_status;
            var categoryname = fields.cat_name;
            var category_image = files.category_image.name;
            if (category_image) {
                var newpath = "./public/admin/images/" + files.category_image.name;
                fs.readFile(oldpath, function (err, data) {
                    if (err) throw err;
                    console.log("File read!");

                    // Write the file
                    fs.writeFile(newpath, data, function (err) {
                        if (err) throw err;
                        console.log("File written!");
                    });

                    // Delete the file
                    fs.unlink(oldpath, function (err) {
                        if (err) throw err;
                        console.log("File deleted!");
                    });
                });
                var sql1 =
                    "INSERT INTO `books_category`(name,image,status,created_at ,updated_at) VALUES ('" +
                    categoryname +
                    "', '" +
                    category_image +
                    "', '" +
                    status +
                    "','" +
                    today +
                    "','" +
                    today +
                    "')";
                var query = db.query(sql1, function (error, result) {
                    if (error) throw new Error("Category Image Problem");
                    res.redirect("/categorypage");
                });
            } else {
                var sql1 =
                    "INSERT INTO `books_category`(name,status,created_at,updated_at) VALUES ('" +
                    categoryname +
                    "','" +
                    status +
                    "','" +
                    today +
                    "','" +
                    today +
                    "')";
                var query = db.query(sql1, function (error, result) {
                    if (error) throw new Error("Category name Problem");
                    res.redirect("/categorypage");
                });
            }
        });
    }
};

exports.Editcategory = function (req, res) {
    var id = req.body.id;
    var data = "";
    var sql1 = "Select * from books_category where id='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.send(data);
    });
};

exports.Updatecategory = function (req, res) {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/updatecategory") {
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.edit_image.path;
            var edit_id = fields.edit_id;
            var status = fields.edit_status;
            var categoryname = fields.edit_name;
            var categoryimage = files.edit_image.name;

            var edit_meta_title = fields.edit_meta_title;
            var edit_meta_description = fields.edit_meta_description;
            var edit_meta_canonical_tag = fields.edit_meta_canonical_tag;
            var edit_category_text = fields.edit_category_text;

            if (categoryimage) {
                var newpath = "./public/admin/images/" + files.edit_image.name;
                fs.readFile(oldpath, function (err, data) {
                    if (err) throw err;
                    console.log("File read!");
                    fs.writeFile(newpath, data, function (err) {
                        if (err) throw err;
                        console.log("File written!");
                    });

                    // Delete the file
                    fs.unlink(oldpath, function (err) {
                        if (err) throw err;
                        console.log("File deleted!");
                    });
                });

                var sql1 =
                    "UPDATE books_category set name='" +
                    categoryname +
                    "', image='" +
                    categoryimage +
                    "', status='" +
                    status +
                    "', meta_title ='" +
                    edit_meta_title +
                    "', meta_description ='" +
                    edit_meta_description +
                    "', meta_canonical_tag ='" +
                    edit_meta_canonical_tag +
                    "', category_text ='" +
                    edit_category_text +
                    "', updated_at='" +
                    today +
                    "' where id='" +
                    edit_id +
                    "'";
                var query = db.query(sql1, function (error, result) {
                    if (error) throw error;
                    req.flash("message", "Category has been successfully updated.");
                    res.redirect("/categorypage");
                });
            } else {
                var sql1 =
                    "UPDATE books_category set name='" +
                    categoryname +
                    "' ,status='" +
                    status +
                    "', meta_title ='" +
                    edit_meta_title +
                    "', meta_description ='" +
                    edit_meta_description +
                    "', meta_canonical_tag ='" +
                    edit_meta_canonical_tag +
                    "', category_text ='" +
                    edit_category_text +
                    "', updated_at='" +
                    today +
                    "' where id='" +
                    edit_id +
                    "'";
                var query = db.query(sql1, function (error, result) {
                    if (error) throw error;
                    req.flash("message", "Category has been successfully updated.");
                    res.redirect("/categorypage");
                });
            }
        });
    }
};

//cartts
exports.Updatecartts = function (req, res) {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/updatecartts") {
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var edit_id = fields.edit_id;
            var name = fields.edit_name;
            var desc = fields.edit_desc;
            var code = fields.edit_code;

            var user_limit = fields.edit_user_limit;
            var valid_from = fields.edit_valid_from;
            var valid_to = fields.edit_valid_to;
            var mini_amt = fields.edit_mini_amt;
            var status = fields.edit_status;

            var sql1 =
                "UPDATE carts set name='" +
                name +
                "' ,status='" +
                status +
                "',descs ='" +
                desc +
                "', code ='" +
                code +
                "', 	user_limit ='" +
                user_limit +
                "', valid_from='" +
                valid_from +
                "', valid_to='" +
                valid_to +
                "', minimum_amt	='" +
                mini_amt +
                "' where id='" +
                edit_id +
                "'";
            var query = db.query(sql1, function (error, result) {
                if (error) throw error;
                req.flash("message", "Cart Detail has been successfully updated.");
                res.redirect("/carttspage");
            });
        });
    }
};
//

//catalog
exports.Updatecatalog = function (req, res) {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/updatecatalog") {
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var edit_id = fields.edit_id;
            var name = fields.edit_name;
            var pub_name = fields.pub_name;
            var auth_name = fields.auth_name;

            var edit_isbn13 = fields.edit_isbn13;
            var edit_isbn10 = fields.edit_isbn10;
            var edit_publishing_year = fields.edit_publishing_year;
            var edit_discount = fields.edit_discount;
            var country = fields.country;
            var currency = fields.currency;
            var edit_valid_from = fields.edit_valid_from;
            var edit_valid_to = fields.edit_valid_to;
            var limit = fields.limit;

            var sql1 =
                "UPDATE catalog_info set name='" +
                name +
                "' ,publisher ='" +
                pub_name +
                "', author ='" +
                auth_name +
                "', 	ISBN13 ='" +
                edit_isbn13 +
                "', ISBN10='" +
                edit_isbn10 +
                "',publishing_year='" +
                edit_publishing_year +
                "', discount	='" +
                edit_discount +
                "', country	='" +
                country +
                "', currency='" +
                currency +
                "', from_d='" +
                edit_valid_from +
                "', to_d='" +
                edit_valid_to +
                "', customer_limit='" +
                limit +
                "' where id='" +
                edit_id +
                "'";
            var query = db.query(sql1, function (error, result) {
                if (error) throw error;
                req.flash("message", "Catalog Detail has been successfully updated.");
                res.redirect("/catalogpage");
            });
        });
    }
};

//

exports.Deletecategory = function (req, res) {
    var id = req.body.id;
    var data = "";
    var sql1 = "UPDATE books_category set is_deleted='1' where id='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.redirect("/categorypage");
    });
};
exports.Deletecatalog = function (req, res) {
    var id = req.params.id;
    var data = "";
    var sql1 = "UPDATE catalog_info set is_deleted='1' where id='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.redirect("/catalogpage");
    });
};

exports.Deletecatalogcondition = function (req, res) {
    var id = req.params.id;
    var data = "";
    var sql1 = "UPDATE catalog_condition set is_deleted='1' where id='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.redirect("/catalogcondition");
    });
};

exports.Deletecarts = function (req, res) {
    var id = req.params.id;
    var data = "";
    var sql1 = "UPDATE carts set is_deleted='1' where id='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.redirect("/carttspage");
    });
};

//catalog
exports.Addcatalogcondition = function (req, res) {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/addcatalogcondition") {
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var category = fields.category;
            var supplies = fields.supplies;
            var brand = fields.brand;
            var catalog = fields.catalog;
            var attribute = fields.attribute;
            var sql1 =
                "INSERT INTO `catalog_condition`(category,brand,supplies,attribute,catalog_id,is_deleted) VALUES ('" +
                category +
                "','" +
                supplies +
                "','" +
                brand +
                "','" +
                catalog +
                "','" +
                attribute +
                "','0')";

            var query = db.query(sql1, function (error, result) {
                console.log(error);
                res.redirect("/catalogcondition");
            });
        });
    }
};

//

//catalog condition
exports.Addcatalog = function (req, res) {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/addcatalog") {
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var name = fields.name;
            var pub_name = fields.pub_name;
            var auth_name = fields.auth_name;
            var isbn13 = fields.isbn13;
            var coun = isbn13.length;
            var isbn10 = fields.isbn10;
            var coun2 = isbn10.length;
            var publishing_year = fields.publishing_year;
            var book_binding = fields.book_binding;
            var discount = fields.discount;
            var country = fields.country;
            var currency = fields.currency;
            var from = fields.edit_valid_from;
            var to = fields.edit_valid_to;
            var limit = fields.limit;
            var group = fields.group;
            var lang = fields.lang;
            var currency = fields.currency;
            if (coun2 != "10") {
                req.flash("message", "ISBN 10 Length Should Be 10");
                res.redirect("/catalogpage");
            } else if (coun != "13") {
                req.flash("message", "ISBN 13 Length Should Be 13");
                res.redirect("/catalogpage");
            } else {
                var sql1 =
                    "INSERT INTO `catalog_info`(name,publisher,author,ISBN13,ISBN10,publishing_year,book_binding,currency,country,catalog_group,discount,from_d,to_d,customer_limit,is_deleted) VALUES ('" +
                    name +
                    "','" +
                    pub_name +
                    "','" +
                    auth_name +
                    "','" +
                    isbn13 +
                    "','" +
                    isbn10 +
                    "','" +
                    publishing_year +
                    "','" +
                    book_binding +
                    "','" +
                    currency +
                    "','" +
                    country +
                    "','" +
                    group +
                    "','" +
                    discount +
                    "','" +
                    from +
                    "','" +
                    to +
                    "','" +
                    limit +
                    "','0')";

                var query = db.query(sql1, function (error, result) {
                    if (error) throw new Error("Category name Problem");
                    res.redirect("/catalogpage");
                });
            }
        });
    }
};
//

//cart
exports.Addcart = function (req, res) {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/addcarts") {
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var name = fields.name;
            var desc = fields.desc;
            var userlimit = fields.userlimit;
            var vdate = fields.vdate;
            var tdate = fields.tdate;
            var mamount = fields.mamount;
            var code = fields.code;

            var sql1 =
                "INSERT INTO `carts`(name,descs,code,user_limit,valid_from,valid_to,minimum_amt,is_deleted,status) VALUES ('" +
                name +
                "','" +
                desc +
                "','" +
                code +
                "','" +
                userlimit +
                "','" +
                vdate +
                "','" +
                tdate +
                "','" +
                mamount +
                "','0','0')";
            // console.log(fields)
            var query = db.query(sql1, function (error, result) {
                if (error) throw new Error("Cart name Problem");
                console.log(error);
                res.redirect("/carttspage");
            });
        });
    }
};
//

exports.Addsubcategory = function (req, res) {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/addsubcategory") {
        let post = req.body;

        console.log("🚀 ~ file: user.js:1329 ~ post:", post);

        let today = new Date().toISOString().slice(0, 19).replace("T", " ");
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            console.log("🚀 ~ file: user.js:1335 ~ fields:", fields);
            // var oldpath = files.subCategoryimage.path;

            var subcategoryname = fields.subCategoryName;
            var categoryid = fields.categoryid;
            let status = 1;

            var sql1 =
                "INSERT INTO `books_sub_category`(name,status,categoryid,created_at,updated_at) VALUES ('" +
                subcategoryname +
                "', '" +
                status +
                "', '" +
                categoryid +
                "', '" +
                today +
                "' ,'" +
                today +
                "' )";
            var query = db.query(sql1, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/subcategorypage");
                }
            });
        });
    } else {
    }
};

exports.Editsubcategory = function (req, res) {
    var id = req.body.id;
    var data = "";
    var sql1 = "select s.* ,c.name as categoryname,c.id as categoryid from subcategory s left join category c on c.id=s.categoryid where s.id='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.send(data);
    });
};

exports.Updatesubcategory = function (req, res) {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/updatesubcategory") {
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            console.log("🚀 ~ file: user.js:1388 ~ fields:", fields);
            var id = fields.subcategory_id;
            var status = fields.editsubCategory_Status;
            var subcategoryname = fields.editSubCategoryName;
            var categoryid = parseInt(fields.categoryid);

            var sql1 =
                "UPDATE books_sub_category set name='" +
                subcategoryname +
                "' , categoryid='" +
                categoryid +
                "',status='" +
                status +
                "',created_at='" +
                today +
                "',updated_at='" +
                today +
                "' where id='" +
                id +
                "'";
            var query = db.query(sql1, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/subcategorypage");
                }
            });
        });
    } else {
    }
};

exports.Deletesubcategory = function (req, res) {
    var id = req.body.id;
    var data = "";
    var sql1 = "UPDATE books_sub_category set is_deleted=1  where id='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.redirect("/subcategorypage");
    });
};

exports.Categorywisesubactegory = function (req, res) {
    var id = req.body.id;
    var sql1 = "select id,name from subcategory where categoryid='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
};

exports.Addproduct = function (req, res) {
    var slugify = require("slugify");
    var formidable = require("formidable");
    var fs = require("fs");
    var user = req.session.user,
        userId = req.session.userId,
        type = req.session.type;
    if (userId == null) {
        res.render("admin/admin", {
            message: "Please login as admin",
            message_success: "",
        });
    }
    if (req.url == "/addproduct") {
        var user = req.session.user,
            userId = req.session.userId;
        // console.log(user);
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();

        form.parse(req, function (err, fields, files) {
            var oldpath = files.product_images.path;
            var product_type_id = fields.product_type_id;
            var product_name = fields.product_name.replace(/'/g, "''");
            var author = fields.author;
            var publisher = fields.publisher;
            var book_edition = fields.book_edition;
            var publishing_year = fields.publishing_year;
            var product_type = fields.product_type;
            var price = fields.price;
            var discount = fields.discount ? fields.discount : 0;
            var ISBN = fields.ISBN;
            var ISBN13 = fields.ISBN13;
            var language = fields.language;
            var category = fields.category;
            var status = fields.status;
            var no_of_pages = fields.no_of_pages ? fields.no_of_pages : 0;
            var book_binding = fields.book_binding;
            var weight = fields.weight;
            var descriptions = fields.descriptions.replace(/'/g, "''");
            var meta_title = fields.meta_title.replace(/'/g, "''");
            var meta_description = fields.meta_description.replace(/'/g, "''");
            var author_details = fields.author_details.replace(/'/g, "''");
            var slug_url = slugify(product_name, {
                replacement: "-",
                remove: /[,*+~.(){}'"\/\\#$%<>?!:@]/g,
                lower: true,
                strict: false,
            });
            var delivery_charge = fields.delivery_charge;
            var quantity = fields.quantity;
            /* unique image name */
            var productimage = Date.now() + files.product_images.name;
            // console.log(productimage);
            if (!product_type_id || product_type_id.search(/\w/) < 0) {
                res.status(200).json({ message: "Please select product type id." });
                return;
            }
            if (!product_name || product_name.search(/\w/) < 0) {
                res.status(200).json({ message: "Product name cannot be empty" });
                return;
            }
            if (!price || price.search(/\w/) < 0) {
                res.status(200).json({ message: "Price cannot be empty" });
                return;
            }
            if (!quantity || quantity.search(/\w/) < 0) {
                res.status(200).json({ message: "quantity cannot be empty" });
                return;
            }

            // var newpath = './public/admin/images/' + productimage;
            fs.readFile(oldpath, function (err, data) {
                if (err) throw err;
                //console.log('File read!');
                const params = {
                    Bucket: process.env.Bucket || "sriinaproduct",
                    Key: productimage,
                    Body: data,
                    ContentType: files.product_images.type,
                };
                s3.upload(params, function (err, s3Data) {
                    if (err) {
                        console.error("Error uploading to S3:", err);
                        return;
                    }
                    // console.log('Image uploaded to S3:', s3Data.Location);
                });
                // Write the file
                // fs.writeFile(newpath, data, function (err) {
                //     if (err) throw err;
                //     //console.log('File written!');
                // });

                // // Delete the file
                // fs.unlink(oldpath, function (err) {
                //     if (err) throw err;
                //     //console.log('File deleted!');
                // });
            });

            let sql1 =
                "INSERT INTO products(`user_id`,`product_type_id`,`name`,`author`,`publisher`,`book_edition`,`price`,`discount`,`delivery_charge`,`quantity`,`isbn`,`isbn13`,`language`,`book_binding`,`cat_id`,`status`,`no_of_pages`,`weight`,`image`,`description`,`slug`,`product_type`,`publishing_year`, `author_details`, `meta_title`, `meta_description`, `created_at`,`updated_at`) VALUES ('" +
                userId +
                "','" +
                product_type_id +
                "','" +
                product_name +
                "', '" +
                author +
                "','" +
                publisher +
                "','" +
                book_edition +
                "', '" +
                price +
                "', '" +
                discount +
                "','" +
                delivery_charge +
                "','" +
                quantity +
                "', '" +
                ISBN +
                "', '" +
                ISBN13 +
                "', '" +
                language +
                "', '" +
                book_binding +
                "', '" +
                category +
                "', '" +
                status +
                "', '" +
                no_of_pages +
                "', '" +
                weight +
                "', '" +
                productimage +
                "','" +
                descriptions +
                "', '" +
                slug_url +
                "', '" +
                product_type +
                "','" +
                publishing_year +
                "', '" +
                author_details +
                "', '" +
                meta_title +
                "','" +
                meta_description +
                "', '" +
                today +
                "','" +
                today +
                "')";

            var query = db.query(sql1, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    req.flash("message", "Product has been successfully added.");
                    res.redirect("/productlist");
                }
            });
        });
    } else {
    }
};

exports.Editproduct = function (req, res) {
    var id = req.body.id;
    var statelist = [];
    var sql1 = "Select * from product  where id='" + id + "'";

    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            var sql2 = "select id , name from subcategory where categoryid='" + result[0]["categoryid"] + "'";
            var query = db.query(sql2, function (err, result1) {
                console.log(result1);
                statelist[0] = result1;
                statelist[1] = result;
                console.log(statelist);
                res.send(statelist);
            });
        }
    });
};

exports.Updateproduct = function (req, res) {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/updateproduct") {
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.editProduct_image.path;
            var id = fields.edit_product_id;
            var status = fields.editProduct_Status;
            var categoryid = fields.editProductCategory_Nameid;
            var subcategoryid = fields.editProductsubCategory_Nameid;
            var productname = fields.edit_Product_Name;
            var description = fields.edit_description;
            var price = fields.edit_price;
            var discount = fields.edit_discount;
            var productimage = files.editProduct_image.name;
            if (productimage) {
                productimage = Date.now() + files.editProduct_image.name;
                fs.readFile(oldpath, function (err, data) {
                    if (err) throw err;
                    const params = {
                        Bucket: process.env.Bucket || "sriinaproduct",
                        Key: productimage,
                        Body: data,
                        // ContentType: files.product_images.type
                    };
                    s3.upload(params, function (err, s3Data) {
                        if (err) {
                            console.error("Error uploading to S3:", err);
                            return;
                        }
                    });
                });
                var sql1 =
                    "UPDATE product set name='" +
                    productname +
                    "', price='" +
                    price +
                    "', discount='" +
                    discount +
                    "', description='" +
                    description +
                    "', image='" +
                    productimage +
                    "', categoryid='" +
                    categoryid +
                    "', subcategoryid='" +
                    subcategoryid +
                    "',status='" +
                    status +
                    "',created_on='" +
                    today +
                    "',modified_on='" +
                    today +
                    "' where id='" +
                    id +
                    "'";
                var query = db.query(sql1, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect("/productpage");
                    }
                });
            } else {
                var sql1 =
                    "UPDATE product set name='" +
                    productname +
                    "', price='" +
                    price +
                    "', discount='" +
                    discount +
                    "', description='" +
                    description +
                    "', categoryid='" +
                    categoryid +
                    "', subcategoryid='" +
                    subcategoryid +
                    "',status='" +
                    status +
                    "',created_on='" +
                    today +
                    "',modified_on='" +
                    today +
                    "' where id='" +
                    id +
                    "'";
                var query = db.query(sql1, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        req.flash("message", "Product has been successfully updated.");
                        res.redirect("/productpage");
                    }
                });
            }
        });
    } else {
    }
};

exports.AdminUpdateProduct = (req, res, next) => {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/adminupdateproduct") {
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.edit_product_images.path;
            var edit_id = fields.edit_id;
            var edit_product_type_id = fields.edit_product_type_id;
            var edit_product_name = fields.edit_product_name.replace(/'/g, "''");
            var edit_author = fields.edit_author.replace(/'/g, "''");
            var edit_publisher = fields.edit_publisher.replace(/'/g, "''");
            var edit_book_edition = fields.edit_book_edition;
            var edit_publishing_year = fields.edit_publishing_year.replace(/'/g, "''");
            var edit_product_type = fields.edit_product_type;
            var edit_price = fields.edit_price;
            var edit_discount = fields.edit_discount ? fields.edit_discount : 0;
            var edit_delivery_charge = fields.edit_delivery_charge ? fields.edit_delivery_charge : 0;
            var edit_quantity = fields.edit_quantity;
            var edit_ISBN = fields.edit_ISBN;
            var edit_ISBN13 = fields.edit_ISBN13;
            var edit_language = fields.edit_language ? fields.edit_language : 1;
            var edit_category = fields.edit_category ? fields.edit_category : 0;
            var edit_no_of_pages = fields.edit_no_of_pages;
            var edit_book_binding = fields.edit_book_binding;
            var weight = fields.edit_weight;
            var edit_included = fields.edit_included;
            var edit_status = fields.edit_status;
            var edit_author_details = fields.edit_author_details.replace(/'/g, "''");
            var edit_meta_title = fields.edit_meta_title.replace(/'/g, "''");
            var edit_meta_description = fields.edit_meta_description.replace(/'/g, "''");
            var edit_descriptions = fields.edit_descriptions.replace(/'/g, "''");
            var productimage = files.edit_product_images.name;
            //console.log(fields);

            if (!edit_product_type_id || edit_product_type_id.search(/\w/) < 0) {
                res.status(200).json({ message: "Product Type cannot be empty" });
                return;
            }

            if (!edit_product_name || edit_product_name.search(/\w/) < 0) {
                res.status(200).json({ message: "Product name cannot be empty" });
                return;
            }
            if (!edit_price || edit_price.search(/\w/) < 0) {
                res.status(200).json({ message: "Price cannot be empty" });
                return;
            }
            if (!edit_quantity || edit_quantity.search(/\w/) < 0) {
                res.status(200).json({ message: "quantity cannot be empty" });
                return;
            }

            if (productimage) {
                var fs = require("fs");
                fs.readFile(oldpath, function (err, data) {
                    if (err) throw err;
                    const params = {
                        Bucket: process.env.Bucket || "sriinaproduct",
                        Key: productimage,
                        Body: data,
                        // ContentType: files.product_images.type
                    };
                    console.log("params", params);
                    s3.upload(params, function (err, s3Data) {
                        if (err) {
                            console.error("Error uploading to S3:", err);
                            req.flash("errors", "Unable to upload image.");
                            res.redirect("/productlist");
                            return;
                        }
                        let sql1 =
                            "UPDATE `products` SET `product_type_id` ='" +
                            edit_product_type_id +
                            "', `name` ='" +
                            edit_product_name +
                            "', `author` = '" +
                            edit_author +
                            "', `publisher` ='" +
                            edit_publisher +
                            "', `book_edition`='" +
                            edit_book_edition +
                            "', `price`='" +
                            edit_price +
                            "',`discount`='" +
                            edit_discount +
                            "', `delivery_charge`='" +
                            edit_delivery_charge +
                            "', `quantity`='" +
                            edit_quantity +
                            "', `isbn`='" +
                            edit_ISBN +
                            "', `isbn13`='" +
                            edit_ISBN13 +
                            "', `language`='" +
                            edit_language +
                            "', `book_binding`='" +
                            edit_book_binding +
                            "', `cat_id`='" +
                            edit_category +
                            "', `status`='" +
                            edit_status +
                            "', `no_of_pages`='" +
                            edit_no_of_pages +
                            "', `weight`='" +
                            weight +
                            "', `image`='" +
                            productimage +
                            "',  `product_type`='" +
                            edit_product_type +
                            "',  `publishing_year`='" +
                            edit_publishing_year +
                            "', `description`='" +
                            edit_descriptions +
                            "', `author_details` ='" +
                            edit_author_details +
                            "', `meta_title` ='" +
                            edit_meta_title +
                            "', `meta_description` ='" +
                            edit_meta_description +
                            "', `updated_at`='" +
                            today +
                            "' WHERE id='" +
                            edit_id +
                            "'";
                        var query = db.query(sql1, function (error, update) {
                            if (error) throw error;
                            req.flash("message", "Product has been successfully updated.");
                            res.redirect("/productlist");
                        });
                    });
                });
            } else {
                let sql1 =
                    "UPDATE `products` SET `product_type_id` ='" +
                    edit_product_type_id +
                    "', `name` ='" +
                    edit_product_name +
                    "', `author` = '" +
                    edit_author +
                    "', `publisher` ='" +
                    edit_publisher +
                    "', `book_edition`='" +
                    edit_book_edition +
                    "', `price`='" +
                    edit_price +
                    "',`discount`='" +
                    edit_discount +
                    "', `delivery_charge`='" +
                    edit_delivery_charge +
                    "', `quantity`='" +
                    edit_quantity +
                    "', `isbn`='" +
                    edit_ISBN +
                    "', `isbn13`='" +
                    edit_ISBN13 +
                    "', `tax_included`='" +
                    edit_included +
                    "', `language`='" +
                    edit_language +
                    "',`book_binding`='" +
                    edit_book_binding +
                    "', `cat_id`='" +
                    edit_category +
                    "', `status`='" +
                    edit_status +
                    "', `no_of_pages`='" +
                    edit_no_of_pages +
                    "', `weight`='" +
                    weight +
                    "', `product_type`='" +
                    edit_product_type +
                    "',  `publishing_year`='" +
                    edit_publishing_year +
                    "', `description`='" +
                    edit_descriptions +
                    "', `author_details` ='" +
                    edit_author_details +
                    "', `meta_title` ='" +
                    edit_meta_title +
                    "', `meta_description` ='" +
                    edit_meta_description +
                    "', `updated_at`='" +
                    today +
                    "' WHERE id='" +
                    edit_id +
                    "'";
                var query = db.query(sql1, function (error, update) {
                    if (error) throw error;
                    req.flash("message", "Product has been successfully updated.");
                    res.redirect("/productlist");
                });
            }
        });
    }
};

exports.Deleteproduct = function (req, res) {
    var id = req.body.id;
    console.log(id);
    return;
    var data = "";
    var sql1 = "UPDATE `products` set is_deleted=1, status=0 where id='" + id + "'";
    var query = db.query(sql1, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            data = result;
        }
        res.redirect("/productpage");
    });
};

exports.checkUniqueISBM13 = (req, res, next) => {
    console.log(req.body);
    return;
};

exports.webPages = (req, res, next) => {
    var sql = "SELECT * FROM pages order by id desc";
    var query = db.query(sql, function (error, gerPages) {
        if (error) throw error;
        res.render("admin/webpage", {
            title: "Pages",
            pageslist: gerPages,
            message: req.flash("message"),
        });
    });
};

exports.addPages = (req, res) => {
    var today = new Date().toISOString().slice(0, 19).replace("T", " ");
    if (req.method == "POST") {
        var title = req.body.title;
        var description = req.body.description;
        var sql = "INSERT INTO pages(title,description,status,created_at) VALUES('" + title + "','" + description + "','0','" + today + "')";
        var query = db.query(sql, function (error, rows) {
            if (error) throw error;
            req.flash("message", "Page has been successfully added.");
            res.redirect("/webpages");
        });
    }
};

exports.editPages = (req, res, next) => {
    if (req.method == "POST") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var edit_id = req.body.edit_id;
        var title = req.body.page_title;
        var status = req.body.status;
        var description = req.body.edit_description;
        var sql =
            "UPDATE pages SET title = '" +
            title +
            "', status = '" +
            status +
            "', description = '" +
            description +
            "', updated_at = '" +
            today +
            "' WHERE id = '" +
            edit_id +
            "'";
        var query = db.query(sql, function (error, updatepages) {
            if (error) throw error;
            req.flash("message", "Page has been successfully updated.");
            res.redirect("/webpages");
        });
    }
};

exports.userResetPwd = (req, res, next) => {
    var bcrypt = require("bcryptjs");
    if (req.method == "POST") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var email = req.body.email;
        var password = req.body.password;
        var hash = bcrypt.hashSync(password, 10);
        var sql = "SELECT * FROM `users` WHERE email='" + email + "' ";
        var query = db.query(sql, function (error, results) {
            if (results.length > 0) {
                var SQL = "UPDATE `users` SET `password` ='" + hash + "' WHERE `email`='" + email + "' ";
                var query = db.query(SQL, function (error, updatePwd) {
                    if (error) throw error;
                    req.flash("message", "Password has been updated on this email Id :" + email);
                    res.redirect("customerpage");
                });
            } else {
                req.flash("message", "Email Id not found in our database.");
                res.redirect("customerpage");
            }
        });
    }
};

exports.menuPages = (req, res, next) => {
    var sql = "SELECT * FROM menu order by id desc";
    var query = db.query(sql, function (error, menuslist) {
        if (error) throw error;
        res.render("admin/menupages", {
            title: "Menu",
            menuslist: menuslist,
            csrfToken: req.csrfToken(),
            message: req.flash("message"),
        });
    });
};

exports.menuPagesPost = (req, res, next) => {
    if (req.method == "POST") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        if (req.body.name === "") {
            console.log("name can not be empty.");
        }
        var name = req.body.name;
        var sql = "INSERT INTO menu(name,status,created_at,updated_at) VALUES('" + name + "','1','" + today + "','" + today + "')";
        var query = db.query(sql, function (error, rows) {
            if (error) throw error;
            req.flash("message", "Menu has been successfully added.");
            res.redirect("/menupages");
        });
    }
};

exports.menuPagesUpdate = (req, res, next) => {
    if (req.method == "POST") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var edit_id = req.body.edit_id;
        var name = req.body.edit_menu_name;
        var status = req.body.edit_menu_status;
        var sql = "UPDATE menu SET name = '" + name + "', status = '" + status + "', updated_at = '" + today + "' WHERE id = '" + edit_id + "'";
        var query = db.query(sql, function (error, updatepages) {
            if (error) throw error;
            req.flash("message", "Menu has been successfully updated.");
            res.redirect("/menupages");
        });
    }
};

exports.Updateddiscount = (req, res, next) => {
    if (req.method == "GET") {
        let title = "Publisher wise discount";
        var sql =
            "SELECT count(*) as total_products, id,discount,quantity,publisher,status,publishing_role_id,imprint_name FROM `products` WHERE `status`='1' group by imprint_name";
        //console.log(sql); return;
        var query = db.query(sql, function (error, updated_discount) {
            if (error) throw error;
            res.render("admin/updatediscount", {
                updated_discount: updated_discount,
                message: req.flash("message"),
                title: title,
            });
        });
    }
};
exports.saveDiscount = (req, res, next) => {
    if (req.method == "POST") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var publishing_role_id = req.body.publishing_role_id;
        var publisher = req.body.edit_publisher;
        var edit_discount = req.body.edit_discount;

        var sql =
            "UPDATE `products` SET `discount` = '" +
            edit_discount +
            "', `updated_at` = '" +
            today +
            "' WHERE `publishing_role_id` = '" +
            publishing_role_id +
            "' and `publisher`='" +
            publisher +
            "' ";
        var query = db.query(sql, function (error, updatepages) {
            if (error) throw error;
            req.flash("message", "Discount has been successfully updated.");
            res.redirect("/updatediscount");
        });
    }
};

exports.adminPreOrderProducts = (req, res, next) => {
    let title = "Pre Order Products";
    let data =
        "SELECT p.name as productname, p.isbn13 as isbn13, p.name as productId, pp.name as username,pp.mobile as usermobile,pp.email as useremail,pp.message as usermessage from products p left join preorder_products pp on pp.product_id=p.id where p.status='1' and p.pre_order_status='1' group by p.name order by pp.id desc";
    let sql = db.query(data, function (error, preorderlist) {
        if (error) throw new Error("DATA PROBLEM");
        res.render("admin/preorder", { preorderlist: preorderlist, title: title });
    });
};

exports.stateONRent = (req, res, next) => {
    let title = "State on rent";
    let data = "SELECT * FROM state_on_rent order by id desc";
    let sql = db.query(data, function (error, stateonrent) {
        if (error) throw new Error("DATA PROBLEM");
        res.render("admin/stateonrent", {
            stateonrent: stateonrent,
            title: title,
            message: req.flash("message"),
            csrfToken: req.csrfToken(),
        });
    });
};

exports.addStateonRent = (req, res) => {
    if (req.method == "POST") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        let name = req.body.name.toLowerCase();
        let code = req.body.code.toLowerCase();
        let status = req.body.status;
        let checkcode = "SELECT * FROM state_on_rent WHERE name='" + name + "' and code='" + code + "'";
        let alredydata = db.query(checkcode, function (error, sqldata) {
            if (sqldata.length > 0) {
                req.flash("message", " Data already available.");
                res.redirect("/state-on-rent");
            } else {
                let sql =
                    "INSERT INTO state_on_rent(name,code,countryid,status,created_on) VALUES('" +
                    name +
                    "','" +
                    code +
                    "','30','" +
                    status +
                    "','" +
                    today +
                    "')";
                let query = db.query(sql, function (error, insertsql) {
                    if (error) throw new Error("INSERT RENT STATE PROBLEM");
                    req.flash("message", "State has been successfully added.");
                    res.redirect("/state-on-rent");
                });
            }
        });
    }
};

exports.updateStateonRent = (req, res) => {
    if (req.method == "POST") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        let name = req.body.edit_name.toLowerCase();
        let code = req.body.edit_code.toLowerCase();
        let status = req.body.edit_status;
        let edit_id = req.body.edit_id;
        let sql =
            "UPDATE state_on_rent SET name ='" +
            name +
            "', code='" +
            code +
            "', status = '" +
            status +
            "', modeified_on='" +
            today +
            "' WHERE id='" +
            edit_id +
            "'";
        let query = db.query(sql, function (error, sqldata) {
            if (error) throw new Error("Data Problem");
            req.flash("message", "State has been successfully updated.");
            res.redirect("/state-on-rent");
        });
    }
};

exports.deleteStateonRent = (req, res) => {
    var id = req.body.id;
    var data = "";
    var sql1 = "DELETE FROM state_on_rent WHERE id='" + id + "'";
    var query = db.query(sql1, function (error, result) {
        if (error) throw new Error("DATA TABLE ERROR");
        data = result;
        req.flash("message", "State has been successfully deleted.");
        res.redirect("/state-on-rent");
    });
};

exports.vendorPage = (req, res) => {
    var sql1 =
        "SELECT u.id as userId,u.name,u.email,u.mobile,u.type,u.status,vi.* from users u left join vendor_info vi on u.id=vi.user_id where u.type='3' order by u.id DESC";
    let title = "Vendor List";
    var query = db.query(sql1, function (error, result) {
        if (error) throw new Error("Table data problem");
        res.render("admin/vendor", {
            vendorlist: result,
            title: title,
            csrfToken: req.csrfToken(),
            message: req.flash("message"),
            errors: req.flash("errors"),
        });
    });
};

exports.updateVendor = (req, res) => {
    if (req.method == "POST") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        let data = req.body;
        var edit_id = xss(data.edit_id);
        var edit_company_mail = xss(data.edit_company_mail);
        var edit_company_name = xss(data.edit_company_name);
        var edit_company_phone = xss(data.edit_company_phone);
        var edit_company_contact_person = xss(data.edit_company_contact_person);
        var edit_company_contact_phone_no = xss(data.edit_company_contact_phone_no);
        var edit_company_gst = xss(data.edit_company_gst);
        var edit_status = xss(data.edit_status);
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

        if (!emailReg.test(edit_company_mail)) {
            req.flash("errors", "Company Email cannot be empty.");
            res.redirect("/vendorpage");
        } else if (!edit_company_name) {
            req.flash("errors", "Company Name cannot be empty.");
            res.redirect("/vendorpage");
        } else if (!edit_company_phone) {
            req.flash("errors", "Company Phone cannot be empty.");
            res.redirect("/vendorpage");
        } else if (!edit_company_contact_person) {
            req.flash("errors", "Company Contact Person cannot be empty.");
            res.redirect("/vendorpage");
        } else if (!edit_company_contact_phone_no) {
            req.flash("errors", "Company Contact Mobile Number be empty.");
            res.redirect("/vendorpage");
        } else {
            /*var q = "SELECT `email`,`mobile` FROM `users` where email='"+edit_company_mail+"'";
            var l = db.query(q,function(error, usersdata){
                if(usersdata.length>0){
                    req.flash('errors','Email id already exists.');
                    res.redirect("/vendorpage");
                } else {*/
            let sql =
                "UPDATE `vendor_info` SET `company_mail`='" +
                edit_company_mail +
                "', `company_name`='" +
                edit_company_name +
                "', `company_phone` ='" +
                edit_company_phone +
                "', `company_contact_person` ='" +
                edit_company_contact_person +
                "',`company_contact_phone_no`='" +
                edit_company_contact_phone_no +
                "', `company_gst` ='" +
                edit_company_gst +
                "' WHERE user_id='" +
                edit_id +
                "'";

            let query = db.query(sql, function (error, updatevendor) {
                if (error) throw new Error("vendor_info tbl update problem");

                let sql_user =
                    "UPDATE `users` SET `name`='" +
                    edit_company_name +
                    "', `email`='" +
                    edit_company_mail +
                    "', `mobile` ='" +
                    edit_company_phone +
                    "', `status`='" +
                    edit_status +
                    "' WHERE id='" +
                    edit_id +
                    "' and `type`='3' ";

                let query_user = db.query(sql_user, function (error, updatevendor) {
                    if (error) throw new Error("users tbl update problem");

                    var transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: "sriinaonlinepvtltd@gmail.com",
                            pass: "*5xT@K812",
                        },
                    });

                    let msg =
                        "Dear " +
                        edit_company_contact_person +
                        ",\nWe appreciate you contacting us Your account has been successfully done.\n you can login from \n https://Sriina.com/admin\n \n \n \n Have great day \n Sriina Team";

                    var mailOptions = {
                        from: "sriinaonlinepvtltd@gmail.com",
                        to: edit_company_mail,
                        subject: "Your account has been activated.!",
                        text: msg,
                        cc: "tech.kishorkumar@gmail.com",
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Email sent: " + info.response);
                        }
                    });

                    req.flash("message", "Vendor has been successfully updated.");
                    res.redirect("/vendorpage");
                });
            });
            //}
            //});
        }
    } else {
        res.redirect("/vendorpage");
    }
};

exports.webSetting = (req, res) => {
    let title = "Web Page Setting";
    var sql1 = "SELECT * FROM settings ORDER BY id desc";
    var query = db.query(sql1, function (error, result) {
        if (error) throw new Error("Table data problem");
        res.render("admin/websettings", {
            permissionlist: result,
            title: title,
            csrfToken: req.csrfToken(),
            message: req.flash("message"),
            errors: req.flash("errors"),
        });
    });
};

exports.updatePermission = (req, res) => {
    if (req.method == "POST") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        let page_name = req.body.edit_page_name.toLowerCase();
        let permission = req.body.edit_permission.toLowerCase();
        let edit_id = req.body.edit_id;
        let sql = "UPDATE settings SET permission='" + permission + "', created_at='" + today + "' WHERE id='" + edit_id + "'";

        let query = db.query(sql, function (error, sqldata) {
            if (error) throw new Error("Table Update Problems");
            req.flash("message", "Permission has been successfully updated.");
            res.redirect("/web_settings");
        });
    }
};
/*exports.ProductList = function(req, res){
    let getSQL ="SELECT * FROM product where is_deleted=0 ORDER BY id DESC";
    db.query(getSQL, function(geterror, results){
        let sql1 ="SELECT * FROM category where is_deleted=0";
        db.query(sql1, function(err, result_category){
            let lastproduct = "SELECT * FROM product ORDER BY id DESC LIMIT 1";
            db.query(lastproduct, function(err, last_product){
                res.render('testproductlist.ejs', {'testproductlist': results,'category_list':result_category,'last_product':last_product})    
            });
        });
        // if (geterror) throw err;
    });
}*/
exports.getGrocerySubCategory = function (req, res) {
    var id = req.body.id;
    var sql = "SELECT id,name FROM grocery_sub_category WHERE grocery_id='" + id + "' and status=1";
    var query = db.query(sql, function (error, results) {
        if (error) throw new Error("Grocery category problems");
        res.send(results);
    });
};

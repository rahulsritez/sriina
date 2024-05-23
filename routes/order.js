const { Console } = require("console");
var moment = require("moment");
exports.orderpage = function (req, res) {
    var user = req.session.user,
        userId = req.session.userId;
    if (userId == null) {
        res.redirect("/admin");
    }
    if (req.session.type == 1 || req.session.type == 5) {
        var sql1 =
            "SELECT `bk_order`.order_id as orderId,`bk_order`.reference,`bk_order`.customer_id,`bk_order`.payment_method as paymentMethod, `bk_order`.paid_amount,`bk_order`.order_status,`bk_order`.created_at as orderDate, `users`.id as userId,`users`.name as username,`users`.email as useremail, `users`.mobile,`bk_order`.payment_gateway_status as paymentStatus,`bk_order`.payment_gateway_id as paymentId FROM `bk_order` LEFT JOIN `users` ON `bk_order`.customer_id = `users`.id where `bk_order`.payment_method != 0 order by `bk_order`.order_id DESC ";
    } else {
        var sql1 =
            "SELECT `bk_order`.order_id as orderId,`bk_order`.reference,`bk_order`.customer_id,`bk_order`.payment_method as paymentMethod, `bk_order`.paid_amount,`bk_order`.order_status,`bk_order`.created_at as orderDate, `users`.id as userId,`users`.name as username,`users`.email as useremail, `users`.mobile,`bk_order`.payment_gateway_status as paymentStatus,`bk_order`.payment_gateway_id as paymentId FROM `bk_order` LEFT JOIN `users` ON `bk_order`.customer_id = `users`.id where `bk_order`.payment_method != 0 and `users`.id='" +
            userId +
            "' order by `bk_order`.order_id DESC ";
    }

    var query = db.query(sql1, function (err, result) {
        var SQL = "SELECT * FROM `products_status` WHERE `status`=1";
        db.query(SQL, function (error, getproductsstatus) {
            res.render("admin/order", {
                orderlist: result,
                moment: moment,
                csrfToken: req.csrfToken(),
                message: req.flash("message"),
                errors: req.flash("errors"),
                getproductsstatus: getproductsstatus,
            });
        });
    });
};

exports.orderViewPage = (req, res, next) => {
    let orderId = req.query.id;
    let sql_userId =
        "SELECT `cart_id`, `customer_id`,`paid_amount`,`created_at`,`bk_order`.`payment_method`,`bk_order`.`payment_gateway_status`,`bk_order`.`payment_gateway_id` FROM bk_order WHERE `reference`='" +
        orderId +
        "'";
    var SQL = db.query(sql_userId, function (error, results) {
        if (error) throw error;
        let userId = results[0].customer_id;
        let created_at = results[0].created_at;
        let paid_amount = results[0].paid_amount;
        let cart_id = results[0].cart_id;

        let paymentMethod = results[0].payment_method;
        let paymentSatus = results[0].payment_gateway_status;
        let paymentId = results[0].payment_gateway_id;

        if (paymentMethod == 1 && paymentSatus == "success" && paymentId != "") {
            var result = results[0].payment_gateway_status;
        } else if (paymentMethod == 1 && paymentId == null && paymentSatus == null) {
            var result = "Failure";
        } else if (paymentMethod == 1 && paymentSatus == null) {
            var result = "Failure";
        } else if (paymentMethod == 2) {
            var result = "POD Payment";
        } else {
            var result = "N/A";
        }

        let get_products =
            "SELECT products.isbn13,products.name,products.price,products.discount,cart_product.cart_id,cart_product.product_id,cart_product.on_rental,sum(cart_product.quantity) as cartquantity, `cart`.cart_id as CartId,`cart`.user_id,`cart`.status FROM products LEFT JOIN cart_product ON products.id = cart_product.product_id LEFT JOIN cart ON cart_product.cart_id = cart.cart_id where cart.user_id='" +
            userId +
            "' and cart.`cart_id`='" +
            cart_id +
            "' group by product_id";
        var QUERY = db.query(get_products, function (error, get_orders) {
            if (error) throw error;
            var SQL =
                "SELECT shipping_information.*,state.name as ShippingState FROM shipping_information LEFT JOIN state ON shipping_information.state = state.id WHERE shipping_information.`user_id`='" +
                userId +
                "'";

            var query = db.query(SQL, function (error, get_shipping_address) {
                if (error) throw error;
                var SQL =
                    "SELECT billing_information.*,state.name as BillingState FROM billing_information LEFT JOIN state ON billing_information.state = state.id WHERE billing_information.`user_id`='" +
                    userId +
                    "'";
                // console.log('SQL -->', SQL)
                var query = db.query(SQL, function (error, get_billing_address) {
                    if (error) throw error;
                    var SQL = "SELECT email FROM users WHERE id='" + userId + "'";
                    var query = db.query(SQL, function (error, getEmail) {
                        if (error) throw error;
                        res.render("admin/vieworder", {
                            getEmail: getEmail[0],
                            orderId: orderId,
                            created_at: created_at,
                            paid_amount: paid_amount,
                            moment: moment,
                            get_orders: get_orders,
                            get_shipping_address: get_shipping_address[0],
                            get_billing_address: get_billing_address[0],
                            result: result,
                        });
                    });
                });
            });
        });
    });
};

exports.adminPlanPage = function (req, res) {
    let sql = "SELECT * FROM plans where 1";
    let title = "Membership Plan";
    let query = db.query(sql, function (error, result) {
        if (error) throw error;
        res.render("admin/adminplanpage", { title: title, getplans: result, message: req.flash("message") });
    });
};

exports.editMembershipPlan = function (req, res) {
    let sql =
        "UPDATE plans SET plan_name='" +
        req.body.plan_name +
        "', plan_price='" +
        req.body.plan_price +
        "', total_month='" +
        req.body.plan_months +
        "', total_book='" +
        req.body.total_book +
        "', monthly_book='" +
        req.body.monthly_book +
        "', is_deleted='" +
        req.body.is_active +
        "' WHERE id=" +
        req.body.edit_id;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        req.flash("message", "Membership plan has been successfully updated.");
        res.redirect("/adminplanpage");
    });
};

exports.homeSlider = function (req, res) {
    let sql = "SELECT * FROM home_slider where 1 order by id desc";
    let title = "Home Slider";
    let query = db.query(sql, function (error, homeslider) {
        res.render("admin/homeslider", { title: title, homeslider: homeslider, message: req.flash("message") });
    });
};

exports.addSlider = function (req, res) {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/addslider") {
        var user = req.session.user,
            userId = req.session.userId;
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.slider_image.path;
            var slider_name = fields.slider_name;
            var descriptions = fields.descriptions;
            var link = fields.link;
            var productimage = files.slider_image.name;
            // console.log(productimage);
            var newpath = "./public/admin/slider/" + files.slider_image.name;
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

                let sql1 =
                    "INSERT INTO home_slider(`slider_name`,`link`,`descriptions`,`images`,`created_at`,`updated_at`) VALUES ('" +
                    slider_name +
                    "','" +
                    link +
                    "','" +
                    descriptions +
                    "','" +
                    productimage +
                    "','" +
                    today +
                    "','" +
                    today +
                    "')";

                var query = db.query(sql1, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect("/homeslider");
                    }
                });
            });
        });
    }
};

exports.UpdateSlider = (req, res, next) => {
    var formidable = require("formidable");
    var fs = require("fs");
    if (req.url == "/updateslider") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.edit_images.path;
            var edit_id = fields.edit_id;
            var slider_name = fields.edit_slider_name;
            var descriptions = fields.edit_descriptions;
            var link = fields.edit_link;
            var status = fields.edit_status;
            var slider_img = files.edit_images.name;
            if (slider_img) {
                var newpath = "./public/admin/slider/" + files.edit_images.name;
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
                let sql1 =
                    "UPDATE `home_slider` SET `slider_name` ='" +
                    slider_name +
                    "', `descriptions` = '" +
                    descriptions +
                    "', `link` ='" +
                    link +
                    "', `images`= '" +
                    slider_img +
                    "' ,`status`='" +
                    status +
                    "', `updated_at`='" +
                    today +
                    "' WHERE id='" +
                    edit_id +
                    "'";
                var query = db.query(sql1, function (error, update) {
                    if (error) throw error;
                    req.flash("message", "Slider has been successfully updated.");
                    res.redirect("/homeslider");
                });
            } else {
                let sql1 =
                    "UPDATE `home_slider` SET `slider_name` ='" +
                    slider_name +
                    "', `descriptions` = '" +
                    descriptions +
                    "', `link` ='" +
                    link +
                    "', `status`='" +
                    status +
                    "', `updated_at`='" +
                    today +
                    "' WHERE id='" +
                    edit_id +
                    "'";
                var query = db.query(sql1, function (error, update) {
                    if (error) throw error;
                    req.flash("message", "Slider has been successfully updated.");
                    res.redirect("/homeslider");
                });
            }
        });
    }
};

exports.primeMembership = (req, res) => {
    if (req.method == "GET") {
        var sql =
            "SELECT `user_plan`.order_id as orderId,`user_plan`.user_id,`user_plan`.paid_amount,`user_plan`.payment_method,`user_plan`.created_at as orderDate, `users`.id as userId,`users`.name as username,`users`.email as useremail, `users`.mobile FROM `user_plan` LEFT JOIN `users` ON `user_plan`.user_id = `users`.id where `user_plan`.payment_method != 0 order by `user_plan`.order_id DESC ";
        var query = db.query(sql, function (error, orderlist) {
            if (error) throw error;
            res.render("admin/primemembership", { orderlist: orderlist, moment: moment });
        });
    }
};

exports.viewPrimeOrder = (req, res) => {
    let orderId = req.query.primeId;
    if (orderId) {
        var sql = "SELECT * FROM `user_plan` WHERE order_id='" + orderId + "'";
        var query = db.query(sql, function (error, get_user_plan_data) {
            if (error) throw new Error("user_plan table problem");
            let userId = get_user_plan_data[0].user_id;
            let plan_id = get_user_plan_data[0].plan_id;
            var SQL =
                "SELECT shipping_information.*,state.name as ShippingState FROM shipping_information LEFT JOIN state ON shipping_information.state = state.id WHERE shipping_information.`user_id`='" +
                userId +
                "'";
            var query = db.query(SQL, function (error, get_shipping_address) {
                if (error) throw new Error("shipping_address table problem");
                var SQL =
                    "SELECT billing_information.*,state.name as BillingState FROM billing_information LEFT JOIN state ON billing_information.state = state.id WHERE billing_information.`user_id`='" +
                    userId +
                    "'";
                var query = db.query(SQL, function (error, get_billing_address) {
                    if (error) throw new Error("billing address problem");
                    var SQL = "SELECT email FROM users WHERE id='" + userId + "'";
                    var query = db.query(SQL, function (error, getEmail) {
                        console.log("🚀 ~ file: order.js:225 ~ query ~ getEmail:", getEmail);
                        if (error) throw new Error("User Table Problem");
                        var sql = "SELECT * FROM plans WHERE id='" + plan_id + "'";
                        var query = db.query(sql, function (error, getplanData) {
                            if (error) throw new Error("plans Table Problem");
                            var sql = "SELECT * FROM membership_book_request WHERE order_id='" + orderId + "'";
                            var query = db.query(sql, function (error, book_requestfromuser) {
                                res.render("admin/viewprimeorder", {
                                    get_user_plan_data: get_user_plan_data[0],
                                    get_shipping_address: get_shipping_address[0],
                                    get_billing_address: get_billing_address[0],
                                    moment: moment,
                                    getEmail: getEmail.length ? getEmail[0] : "",
                                    getplanData: getplanData[0],
                                    book_requestfromuser: book_requestfromuser,
                                    message: req.flash("message"),
                                });
                            });
                        });
                    });
                });
            });
        });
    } else {
        console.log("Something went wrong Please try again");
    }
};

exports.addPrimeBook = (req, res, next) => {
    var formidable = require("formidable");
    if (req.url == "/addprimebook") {
        var userId = req.session.userId;
        var post = req.body;
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        let orderId = post.orderId;
        let book_name = post.book_name;
        let author = post.author;
        let publisher = post.publisher;
        let book_edition = post.book_edition;
        let isbn = post.isbn;
        let message = post.message;

        if (!book_name || book_name.search(/\w/) < 0) {
            res.status(200).json({ message: "Book name cannot be empty" });
            return;
        }

        if (!author || author.search(/\w/) < 0) {
            res.status(200).json({ message: "Author name cannot be empty" });
            return;
        }

        if (!publisher || publisher.search(/\w/) < 0) {
            res.status(200).json({ message: "Publisher name cannot be empty" });
            return;
        }
        if (!isbn || isbn.search(/\w/) < 0) {
            res.status(200).json({ message: "isbn name cannot be empty" });
            return;
        }

        var sql =
            "INSERT INTO addprimebook(order_id,user_id,book_name,author,publisher,book_edition,isbn,message,created_at)VALUES('" +
            orderId +
            "','" +
            userId +
            "','" +
            book_name +
            "','" +
            author +
            "','" +
            publisher +
            "','" +
            book_edition +
            "','" +
            isbn +
            "','" +
            message +
            "','" +
            today +
            "')";
        var query = db.query(sql, function (error, insertdata) {
            if (error) throw new Error("INsert problem in table addprimebook");
            req.flash("message", "Books has been successfully added to Prime Id." + orderId);
            res.redirect("/viewprimeorder" + "?primeId=" + orderId);
        });
    }
};

/*exports.delayBoxMassege = (req,res) => {
    var xss = require("xss");
    var nodemailer = require('nodemailer');
    var userId = req.session.userId;
    if(userId == null){
        res.redirect('/admin');
    }
    if(req.url == "/delay_box_massege"){
        var today = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let data = req.body;
        message = data.edit_message;
        var remove_tag = message.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");

        if(data.edit_message==""){
            req.flash('errors','Message can not be empty.');
            res.redirect("/orderpage");
        } else {
            var sql = "INSERT INTO delay_box(user_id,order_id,name,email,message,created_at,updated_at) VALUES('"+userId+"','"+xss(data.edit_reference)+"','"+xss(data.edit_username)+"','"+xss(data.edit_useremail)+"','"+xss(data.edit_message)+"','"+today+"','"+today+"')";
            query = db.query(sql, function(error,data){
                if(error) throw new Error('Insert problem in table delay_box');
                if(data){
                    var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'sriinaonlinepvtltd@gmail.com',
                        pass: '*5xT@K812'
                    }
                  });
                  
                  let msg = 'Dear '+xss(req.body.edit_username)+',\nWe apologize for the inconvenience. '+xss(remove_tag)+'\n \n \n Have great day \n Sriina Team';

                  var mailOptions = {
                    from: 'sriinaonlinepvtltd@gmail.com',
                    to: xss(req.body.edit_useremail),
                    subject: 'Your order '+ xss(req.body.edit_reference) + ' is on the way.!',
                    text: msg,
                  };
  
                  transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                          console.log(error);
                      } else {
                          console.log('Email sent: ' + info.response);
                      }
                  });
                    req.flash('message','Message has been sent to register email id.');
                    res.redirect("/orderpage");
                }
            });
        }
    }
}

exports.cancelProductFromAdmin = (req,res) => {
    var xss = require("xss");
    var nodemailer = require('nodemailer');
    var userId = req.session.userId;
    if(userId == null){
        res.redirect('/admin');
    }
    if(req.url == "/cancel_product_from_admin"){
        var today = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let data = req.body;
        message = data.edit_c_message;
        var remove_tag = message.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");

        if(data.edit_c_message==""){
            req.flash('errors','Message can not be empty.');
            res.redirect("/orderpage");
        } else {
            var sql = "INSERT INTO cancel_product_from_admin(user_id,order_id,name,email,reason,message,created_at,updated_at) VALUES('"+userId+"','"+xss(data.edit_c_reference)+"','"+xss(data.edit_c_username)+"','"+xss(data.edit_c_useremail)+"','"+xss(data.reason)+"','"+xss(data.edit_c_message)+"','"+today+"','"+today+"')";
            
            query = db.query(sql, function(error,data){
                if(error) throw new Error('Insert problem in table cancel_product_from_admin');
                if(data){
                    var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'sriinaonlinepvtltd@gmail.com',
                        pass: '*5xT@K812'
                    }
                  });
                  
                  let msg = 'Dear '+xss(req.body.edit_c_username)+',\nWe apologize for the inconvenience. '+xss(remove_tag)+'\n \n \n Have great day \n Sriina Team';

                  var mailOptions = {
                    from: 'sriinaonlinepvtltd@gmail.com',
                    to: xss(req.body.edit_c_useremail),
                    subject: 'Your order has been'+ xss(req.body.edit_c_reference) + ' cancelled.!',
                    text: msg,
                  };
  
                  transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                          console.log(error);
                      } else {
                          console.log('Email sent: ' + info.response);
                      }
                  });
                    req.flash('message','Message has been sent to register email id.');
                    res.redirect("/orderpage");
                }
            });
        }
    }
}*/

exports.delayBoxMassege = (req, res) => {
    var xss = require("xss");
    var nodemailer = require("nodemailer");
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/admin");
    }
    if (req.url == "/delay_box_massege") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        let data = req.body;
        message = data.edit_message;
        var remove_tag = message.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, "");

        if (data.edit_message == "") {
            req.flash("errors", "Message can not be empty.");
            res.redirect("/orderpage");
        } else {
            var sql =
                "INSERT INTO delay_box(user_id,order_id,name,email,message,created_at,updated_at)VALUES('" +
                userId +
                "','" +
                xss(data.edit_reference) +
                "','" +
                xss(data.edit_username) +
                "','" +
                xss(data.edit_useremail) +
                "','" +
                xss(data.edit_message) +
                "','" +
                today +
                "','" +
                today +
                "')";
            query = db.query(sql, function (error, data) {
                if (error) throw new Error("Insert problem in table delay_box");
                if (data) {
                    var update =
                        "UPDATE `bk_order` set `order_status`='8', `updated_at`='" + today + "' where reference='" + xss(req.body.edit_reference) + "' ";

                    var query = db.query(update, function (error, updatedata) {
                        if (updatedata) {
                            var transporter = nodemailer.createTransport({
                                service: "gmail",
                                auth: {
                                    user: "sriinaonlinepvtltd@gmail.com",
                                    pass: "*5xT@K812",
                                },
                            });

                            let msg =
                                "Dear " +
                                xss(req.body.edit_username) +
                                ",\nWe apologize for the inconvenience. " +
                                xss(remove_tag) +
                                "\n \n \n Have great day \n Sriina Team";

                            var mailOptions = {
                                from: "sriinaonlinepvtltd@gmail.com",
                                to: xss(req.body.edit_useremail),
                                subject: "Your order " + xss(req.body.edit_reference) + " is on the way.!",
                                text: msg,
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log("Email sent: " + info.response);
                                }
                            });
                        }
                        req.flash("message", "Message has been sent to register email id.");
                        res.redirect("/orderpage");
                    });
                }
            });
        }
    }
};

exports.cancelProductFromAdmin = (req, res) => {
    var xss = require("xss");
    var nodemailer = require("nodemailer");
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/admin");
    }
    if (req.url == "/cancel_product_from_admin") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        let data = req.body;
        message = data.edit_c_message;
        var remove_tag = message.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, "");

        if (data.edit_c_message == "") {
            req.flash("errors", "Message can not be empty.");
            res.redirect("/orderpage");
        } else {
            var sql =
                "INSERT INTO `cancel_product_from_admin`(`user_id`,`order_id`,`name`,`email`,`reason`,`message`,`created_at`,`updated_at`) VALUES('" +
                userId +
                "','" +
                xss(data.edit_c_reference) +
                "','" +
                xss(data.edit_c_username) +
                "','" +
                xss(data.edit_c_useremail) +
                "','" +
                xss(data.reason) +
                "','" +
                xss(data.edit_c_message) +
                "','" +
                today +
                "','" +
                today +
                "')";

            query = db.query(sql, function (error, data) {
                if (error) throw new Error("Insert problem in table cancel_product_from_admin");
                if (data) {
                    var update =
                        "UPDATE `bk_order` set `order_status`='9', `updated_at`='" + today + "' where reference='" + xss(req.body.edit_c_reference) + "' ";

                    var query = db.query(update, function (error, updatedata) {
                        if (updatedata) {
                            var transporter = nodemailer.createTransport({
                                service: "gmail",
                                auth: {
                                    user: "sriinaonlinepvtltd@gmail.com",
                                    pass: "*5xT@K812",
                                },
                            });

                            let msg =
                                "Dear " +
                                xss(req.body.edit_c_username) +
                                ",\nWe apologize for the inconvenience. " +
                                xss(remove_tag) +
                                "\n \n \n Have great day \n Sriina Team";

                            var mailOptions = {
                                from: "sriinaonlinepvtltd@gmail.com",
                                to: xss(req.body.edit_c_useremail),
                                subject: "Your order has been" + xss(req.body.edit_c_reference) + " cancelled.!",
                                text: msg,
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log("Email sent: " + info.response);
                                }
                            });
                        }

                        req.flash("message", "Message has been sent to register email id.");
                        res.redirect("/orderpage");
                    });
                }
            });
        }
    }
};

exports.updateProductStatus = (req, res) => {
    var xss = require("xss");
    var nodemailer = require("nodemailer");
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/admin");
    }
    if (req.url == "/update_product_status") {
        var today = new Date().toISOString().slice(0, 19).replace("T", " ");
        let data = req.body;
        products_status = data.products_status;

        if (data.products_status == "") {
            req.flash("errors", "Product status can not be empty.");
            res.redirect("/orderpage");
        } else {
            var sql =
                "UPDATE `bk_order` set `order_status`='" +
                xss(data.products_status) +
                "', `updated_at`='" +
                today +
                "' where reference='" +
                xss(data.edit_reference_de) +
                "' ";

            query = db.query(sql, function (error, data) {
                if (error) throw new Error("Insert problem in table bk_order");
                if (data) {
                    req.flash("message", "Products status has been successfully updated.");
                    res.redirect("/orderpage");
                }
            });
        }
    }
};

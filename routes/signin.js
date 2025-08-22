const { json } = require("body-parser");
const cons = require("consolidate");
const svgCaptcha = require("svg-captcha");
//const flash = require('connect-flash');
const validator = require("validator");
const session = require("express-session");
var bcrypt = require("bcryptjs");
//const {checkBody,expressValidator} = require('express-validator');
const jsSHA = require("jssha");
const request = require("request");
var payumoney = require("payumoney-node");
var moment = require("moment");
const { PaymentSuccess } = require("./payumoney");
const { saveAddtoCart } = require("../routes/product");
require("dotenv").config();

/* stripe key */
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/* Twilio auth */
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

/* Razorpay */
const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const URL = process.env.URL;

const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");
var nodemailer = require("nodemailer");
var xss = require("xss");

var captchaText = "";
function getCaptcha() {
  var captcha = svgCaptcha.create({ color: true, mathMin: 1, mathMax: 9 });
  captchaText = captcha.text;
  return captcha;
}

function requireLogin(req, res, next) {
  if (!req.user) {
    res.redirect("/signup");
  } else {
    next();
  }
}

exports.userSignIn = function (req, res, next) {
  req.session.membershipId = req.query.membershipId;
  var formregister_errors = {};
  res.render("users/signin.ejs", {
    title: "signin form",
    success: req.flash("success"),
    errors: req.flash("errors"),
    message: req.flash("message"),
    csrfToken: req.csrfToken(),
    formregister_errors: "",
  });
};

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/myaccount");
  } else {
    next();
  }
};
exports.userRegisters = (req, res, next) => {
  var requestIp = require("request-ip");
  var clientIp = requestIp.getClientIp(req);
  var Hogan = require("hogan.js");
  var fs = require("fs");
  var template = fs.readFileSync("./views/emails/register_email.ejs", "utf-8");
  var compiledTemplate = Hogan.compile(template);

  if (req.method == "POST") {
    const pay = req.body;
    var username = xss(pay.username);
    var useremail = xss(pay.useremail);
    var userphone = xss(pay.userphone);
    var pass = xss(pay.password);
    const rounds = 10;
    var hash = bcrypt.hashSync(pass, rounds);
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    console.log("useremail", useremail);

    if (!useremail || useremail.search(/\w/) < 0) {
      req.flash("errors", "Email Id cannot be empty.");
      res.redirect("/sign-in");
    } else if (!emailReg.test(useremail)) {
      req.flash("errors", "Username cannot be empty.");
      res.redirect("/sign-in");
    } else if (!username || username.search(/\w/) < 0) {
      req.flash("errors", "Name must be of 3 characters long.");
      res.redirect("/sign-in");
    } else if (!username.length >= 3) {
      req.flash("errors", "Mobile cannot be empty.");
      res.redirect("/sign-in");
    } else if (!userphone || userphone.search(/\w/) < 0) {
      req.flash("errors", "Mobile number lenght is short.");
      res.redirect("/sign-in");
    } else if (!userphone.length == "10") {
      req.flash("errors", "Password cannot be empty.");
      res.redirect("/sign-in");
    } else if (!pass || pass.search(/\w/) < 0) {
      req.flash("errors", "Password cannot be empty.");
      res.redirect("/sign-in");
    } else if (!pass.length > 5) {
      req.flash("errors", "Password lenght should be 6 character long.");
      res.redirect("/sign-in");
    } else {
      var today = new Date().toISOString().slice(0, 19).replace("T", " ");
      var sql =
        "select email,mobile from users where email='" +
        useremail +
        "' or mobile='" +
        userphone +
        "'";
      var query = db.query(sql, function (error, result) {
        if (error) throw new Error("User Data Problem");
        if (result.length > 0) {
          req.flash(
            "errors",
            "User already registered with same email id or mobile"
          );
          res.redirect("/sign-in");
        } else {
          var sql1 =
            "INSERT INTO `users`(`name`,`email`,`mobile`,`type`, `password`,createdby,modifiedby,ip_address) VALUES ('" +
            username +
            "', '" +
            useremail +
            "', '" +
            userphone +
            "','0', '" +
            hash +
            "','" +
            today +
            "','" +
            today +
            "','" +
            clientIp +
            "')";
          var query = db.query(sql1, async function (err, result) {
            if (err) {
              console.log("Database Insert Error: ", err);
              req.flash("errors", "Data cannot be inserted.");
              return res.redirect("/sign-in");
            }

            const bodyContent =
              "Sriina: Dear, " +
              username +
              " Thank you for registering with us your account has been successfully created username: " +
              useremail +
              " and password: " +
              pass +
              "";
            if (useremail !== null && userphone !== "") {
              await client.messages
                .create({
                  body: bodyContent,
                  from: "+15627849373",
                  to: "+91" + userphone,
                })
                .then((message) => {
                  orderSMS = true;
                  console.log("twilio register message -->", message);
                })
                .catch((error) => {
                  orderData = false;
                  console.log("twilio register error -->", error);
                });
            }

            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
              },
            });

            var mailOptions = {
              //from: 'order@sriina.com',
              from: "no-reply@gmail.com",
              to: useremail,
              subject: "Registration has been done successfully",
              html: compiledTemplate.render({
                username: username,
                useremail: useremail,
                pass: pass,
              }),
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log("mail error send---->", info);
                req.flash(
                  "errors",
                  "We are sorry we're not able to identify you given the information provided."
                );
                res.redirect("/sign-in");
              } else {
                console.log("Email sent: " + info.response);
                console.log("sent", info);
                setTimeout(() => {
                  req.body.username = useremail;
                  exports.userLogin(req, res);
                }, 500); // S
              }
            });
          });
        }
      });
    }
  }
};

exports.dashboardProfile = function (req, res) {
  let title = "User Profile";
  var user = req.session.user,
    userId = req.session.userId;
  var email = req.session.email;
  var createdby = req.session.createdby;
  //console.log(user);
  if (userId == null) {
    res.redirect("/sign-in");
  } else {
    res.render("myaccount", { user: user, email: email });
    /*var sql_data ="SELECT * FROM `users` WHERE `id`='"+userId+"' and `type`= '"+0+"'";
        db.query(sql_data, function(error, getdata){
            res.render('users/dashboard.ejs',{'getdata':getdata[0]});
        });*/
  }
};

const { body, validationResult } = require("express-validator");
const { methods } = require("underscore");

exports.userLogin = (req, res) => {
  if (req.method == "POST") {
    var isCart = false;
    var post = req.body;
    var username = xss(post.username);
    var pass = xss(post.password);

    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    if (!username || username.search(/\w/) < 0) {
      req.flash("errors", "Username name cannot be empty.");
      if (isCart) {
        res.redirect(
          `/sign-in?product_id=${req.body.product_id}&quantity=${req.body.quantity_form}&name=${req.body.name_form}&image=${req.body.image_form}&price=${req.body.price_form}`
        );
      } else {
        res.redirect("/sign-in");
      }
    } else if (!emailReg.test(username)) {
      req.flash("errors", "Invalid email id.");
      if (isCart) {
        res.redirect(
          `/sign-in?product_id=${req.body.product_id}&quantity=${req.body.quantity_form}&name=${req.body.name_form}&image=${req.body.image_form}&price=${req.body.price_form}`
        );
      } else {
        res.redirect("/sign-in");
      }
    } else if (!pass || pass.search(/\w/) < 0) {
      req.flash("errors", "Password name cannot be empty.");
      if (isCart) {
        res.redirect(
          `/sign-in?product_id=${req.body.product_id}&quantity=${req.body.quantity_form}&name=${req.body.name_form}&image=${req.body.image_form}&price=${req.body.price_form}`
        );
      } else {
        res.redirect("/sign-in");
      }
    } else {
      let cartData = req.session.addToCart;
      if (cartData) {
        isCart = true;
      }
      var sql =
        "SELECT id, name, email, mobile, password FROM `users` WHERE `email`='" +
        username +
        "' and `type`= '" +
        0 +
        "'";
      db.query(sql, function (err, results) {
        if (results.length > 0) {
          bcrypt.compare(pass, results[0].password, function (err, ress) {
            if (ress) {
              req.session.userId = results[0].id;
              req.session.user = results[0];
              if (cartData) {
                isCart = true;
                delete req.session.addToCart;
                req.body.quantity = cartData.quantity;
                req.body.product_id = cartData.product_id;

                if (
                  parseInt(req.body.quantity_form) > parseInt(cartData.quantity)
                ) {
                  req.body.quantity = parseInt(req.body.quantity_form);
                }
                saveAddtoCart(req, res);
              } else {
                res.redirect("/addtocart");
              }
            } else {
              req.flash("errors", "Invalid Credential.");
              if (isCart) {
                res.redirect(
                  `/sign-in?product_id=${req.body.product_id}&quantity=${req.body.quantity_form}&name=${req.body.name_form}&image=${req.body.image_form}&price=${req.body.price_form}`
                );
              } else {
                res.redirect("/sign-in");
              }
            }
          });
        } else {
          req.flash("errors", "Invalid Credential.");
          if (isCart) {
            res.redirect(
              `/sign-in?product_id=${req.body.product_id}&quantity=${req.body.quantity_form}&name=${req.body.name_form}&image=${req.body.image_form}&price=${req.body.price_form}`
            );
          } else {
            res.redirect("/sign-in");
          }
        }
      });
    }
  }
};

exports.deleteInCart = (req, res, next) => {
  if (req.method == "POST") {
    var post = req.body;
    var product_id = post.product_id;
    var user = req.session.user,
      userId = req.session.userId;
    if (userId == null) {
      res.redirect("/sign-in");
    } else {
      var sql =
        "DELETE `cart_product`  FROM `cart_product`  LEFT JOIN `cart` ON `cart_product`.cart_id = `cart`.cart_id WHERE `cart`.user_id ='" +
        userId +
        "' and `cart_product`.product_id = '" +
        product_id +
        "'";
      db.query(sql, function (err, result) {
        if (err) {
          throw err;
        } else {
          // req.flash('message', 'Your item has been successfully removed from your cart.');
          res.redirect("/addtocart");
        }
      });
    }
  }
};

exports.addCallBack = (req, res, next) => {
  if (req.method == "POST") {
    var post = req.body;
    var product_id = post.product_id;
    var username = post.username;
    var userphone = post.userphone;
    var today = new Date().toISOString().slice(0, 19).replace("T", " ");
    var sql1 =
      "INSERT INTO `request_call_back`(`product_id`,`username`,`userphone`,`created_at`,`updated_at`) VALUES ('" +
      product_id +
      "', '" +
      username +
      "', '" +
      userphone +
      "','" +
      today +
      "','" +
      today +
      "')";
    var query = db.query(sql1, function (err, result) {
      if (err) {
        throw err;
      } else {
        req.flash(
          "message",
          "Your request has been sent to admin they will call back soon."
        );
        res.redirect("/view/" + product_id);
      }
    });
  }
};

exports.getCaptchaajax = function (req, res, next) {
  var captcha = svgCaptcha.create({ color: true, mathMin: 1, mathMax: 9 });
  captchaText = captcha.text;
  var svgTag = getCaptcha().data;
  res.status(200).json({ captchacode: svgTag });
  return;
};

exports.shoppingCheckOut = function (req, res, next) {
  if (req.method == "GET") {
    var svgTag = getCaptcha().data;
    var total_amount = xss(req.query.total_amount);
    var total_amount = xss(req.query.total_amount);
    //var login = JSON.stringify(req.query.login);
    var user = req.session.user,
      userId = req.session.userId;
    var txnid = Math.floor(10000000 + Math.random() * 90000000);
    txnid = "STZ" + txnid;
    if (userId == null) {
      res.redirect("/sign-in");
    } else {
      var sql = "SELECT * FROM users WHERE id='" + userId + "'";
      var query = db.query(sql, function (err, result) {
        var get_state = "SELECT * FROM state where status=1";
        var query = db.query(get_state, function (err, getstate) {
          if (err) {
            throw err;
          } else {
            /*var get_count_total = "SELECT `products`.id as productId,`products`.price,`products`.quantity,`products`.status,`products`.discount,`products`.delivery_charge,`cart_product`.cart_id,`cart_product`.product_id,`cart_product`.quantity, sum(cart_product.quantity) as cartquantity,`cart_product`.on_rental, `cart`.cart_id as CartId,`cart`.user_id,`cart`.status FROM `products` LEFT JOIN `cart_product` ON `products`.id = `cart_product`.product_id LEFT JOIN `cart` ON `cart_product`.cart_id = `cart`.cart_id where `cart`.user_id = '"+userId+"' and `cart`.status='0' group by product_id ";*/
            var get_count_total =
              "SELECT `products`.id as productId,`products`.price,`products`.quantity,`products`.status,`products`.discount,`products`.delivery_charge,`cart_product`.cart_id,`cart_product`.product_id,`cart_product`.quantity, sum(cart_product.quantity) as cartquantity,`cart_product`.on_rental, `cart`.cart_id as CartId,`cart`.user_id,`cart`.status,`product_variables`.unit_price as groceyProductPrice, `product_variables`.unit_discount as unitDiscount FROM `products` LEFT JOIN `cart_product` ON `products`.id = `cart_product`.product_id LEFT JOIN `cart` ON `cart_product`.cart_id = `cart`.cart_id  LEFT JOIN `product_variables` ON `products`.id = `product_variables`.product_id where `cart`.user_id = '" +
              userId +
              "' and `cart`.status='0' group by product_id ";
            //console.log(get_count_total); return;
            var query = db.query(
              get_count_total,
              function (error, totalAmount) {
                if (error) {
                  throw error;
                } else {
                  var total = 0;
                  var CartId = 0;
                  var productId = 0;
                  var delivery_charge = 0;
                  console.log("totalAmount---->", totalAmount);
                  /*totalAmount.forEach((list, index)=>{
                                    let newTotal = (list.price) * (list.cartquantity)
                                    let afterdiscount = (newTotal)-(newTotal/100)*list.discount;
                                    total +=afterdiscount;
                                    CartId = list.CartId;
                                    delivery_charge = list.delivery_charge;
                                });*/
                  totalAmount.forEach((list, index) => {
                    let newTotal = list.price * list.cartquantity;
                    let afterdiscount =
                      newTotal - (newTotal / 100) * list.discount;

                    let newTotalGrocey =
                      list.groceyProductPrice * list.cartquantity;
                    let afterdiscountGrocery =
                      newTotalGrocey -
                      (newTotalGrocey / 100) * list.unitDiscount;

                    total +=
                      parseFloat(afterdiscount) +
                      parseFloat(afterdiscountGrocery);
                    CartId = list.CartId;
                    productId = list.productId;
                    delivery_charge += parseFloat(
                      list.delivery_charge == null ? 0 : list.delivery_charge
                    );
                  });

                  var on_rental = totalAmount[0].on_rental;
                  var subtotal =
                    parseFloat(total) + parseFloat(delivery_charge);
                  delivery_charge = parseFloat(delivery_charge);

                  var SQL_RENT_STATE =
                    "SELECT * FROM state_on_rent WHERE status='1' ORDER BY name";
                  var query = db.query(
                    SQL_RENT_STATE,
                    function (error, get_rent_state) {
                      if (error) throw error;
                      var SQL =
                        "SELECT `shipping_information`.*,`state`.name as ShippingState, `country`.name as shippingCountyName FROM `shipping_information` LEFT JOIN `state` ON `shipping_information`.state = `state`.id LEFT JOIN `country` ON `state`.countryid = `country`.id WHERE shipping_information.`user_id`='" +
                        userId +
                        "' ";

                      var query = db.query(SQL, function (error, getshipping) {
                        if (error) throw error;
                        var SQL =
                          "SELECT `billing_information`.*,`state`.name as ShippingState, `country`.name as billingCountyName FROM `billing_information` LEFT JOIN `state` ON `billing_information`.state = `state`.id LEFT JOIN `country` ON `state`.countryid = `country`.id WHERE billing_information.`user_id`='" +
                          userId +
                          "' ";

                        var query = db.query(SQL, function (error, getbilling) {
                          if (error) throw error;
                          let permission = "SELECT * FROM settings where id=1";
                          var query = db.query(
                            permission,
                            function (error, getpermission) {
                              if (error)
                                throw new Error("Permission Page Error");
                              res.render("shoppingcart/checkout", {
                                cryptr: cryptr,
                                CartId: CartId,
                                txnid: txnid,
                                total_amount: total_amount,
                                result: result[0],
                                delivery_charge: delivery_charge,
                                subtotal: subtotal,
                                message: req.flash("message"),
                                errors: req.flash("errors"),
                                get_state: getstate,
                                total: parseFloat(total),
                                captchaImage: svgTag,
                                errorStatus: "",
                                on_rental: on_rental,
                                get_rent_state: get_rent_state,
                                getshipping: getshipping,
                                getbilling: getbilling,
                                csrfToken: req.csrfToken(),
                                getpermission: getpermission[0],
                              });
                            }
                          );
                        });
                      });
                    }
                  );
                }
              }
            );
          }
        });
      });
    }
  }
};

exports.billingInformation = (req, res, next) => {
  var today = new Date().toISOString().slice(0, 19).replace("T", " ");
  if (req.method == "POST") {
    var post = req.body;
    var fullname = xss(post.fullname);
    var mobile = xss(post.mobile);
    var pincode = xss(post.pincode);
    var house_address = xss(post.house_address);
    var colony_area = xss(post.colony_area);
    var landmark = xss(post.landmark);
    var city_town = xss(post.city_town);
    var state = xss(post.state);
    var membershipcheckout_billing = xss(post.membershipcheckout_billing);

    var user = req.session.user,
      userId = req.session.userId;

    if (!fullname || fullname.search(/\w/) < 0) {
      res.status(200).json({ message: "Fullame cannot be empty" });
      return;
    }
    if (!mobile || mobile.length != 10) {
      res.status(200).json({ message: "mobile cannot be empty" });
      return;
    }
    if (!pincode || pincode.length != 6) {
      res.status(200).json({ message: "pincode cannot be empty" });
      return;
    }
    if (!house_address || house_address.search(/\w/) < 0) {
      res.status(200).json({ message: "House address cannot be empty" });
      return;
    }
    if (!city_town || city_town.search(/\w/) < 0) {
      res.status(200).json({ message: "City Town cannot be empty" });
      return;
    }
    if (!state) {
      res.status(200).json({ message: "State cannot be empty" });
      return;
    }

    if (userId == null) {
      res.redirect("/sign-in");
    } else {
      var sql =
        "INSERT INTO `billing_information`(`user_id`,`fullname`,`mobile`,`pincode`,`house_address`, `colony_area`,landmark,city_town,state,created_at,updated_at) VALUES ('" +
        userId +
        "', '" +
        fullname +
        "', '" +
        mobile +
        "','" +
        pincode +
        "', '" +
        house_address +
        "', '" +
        colony_area +
        "', '" +
        landmark +
        "', '" +
        city_town +
        "', '" +
        state +
        "','" +
        today +
        "','" +
        today +
        "')";
      var query = db.query(sql, function (error, result) {
        if (error) {
          throw error;
        } else {
          if (membershipcheckout_billing == 1) {
            req.flash(
              "message",
              "Your Billing Information has been succefully added."
            );
            res.redirect("membership_checkout");
          } else {
            req.flash(
              "message",
              "Your Billing Information has been succefully added."
            );
            res.redirect("checkout");
          }
        }
      });
    }
  }
};

exports.shippingInformation = (req, res, next) => {
  var today = new Date().toISOString().slice(0, 19).replace("T", " ");
  if (req.method == "POST") {
    var post = req.body;
    var fullname = xss(post.fullname);
    var mobile = xss(post.mobile);
    var pincode = xss(post.pincode);
    var house_address = xss(post.house_address);
    var colony_area = xss(post.colony_area);
    var landmark = xss(post.landmark);
    var city_town = xss(post.city_town);
    var state = xss(post.state);
    var membershipcheckout_shipping = xss(post.membershipcheckout_shipping);

    var user = req.session.user,
      userId = req.session.userId;

    if (!fullname || fullname.search(/\w/) < 0) {
      res.status(200).json({ message: "Fullame cannot be empty" });
      return;
    }
    if (!mobile || mobile.length != 10) {
      res.status(200).json({ message: "mobile cannot be empty" });
      return;
    }
    if (!pincode || pincode.length != 6) {
      res.status(200).json({ message: "pincode cannot be empty" });
      return;
    }
    if (!house_address || house_address.search(/\w/) < 0) {
      res.status(200).json({ message: "House address cannot be empty" });
      return;
    }
    if (!city_town || city_town.search(/\w/) < 0) {
      res.status(200).json({ message: "City Town cannot be empty" });
      return;
    }
    if (!state) {
      res.status(200).json({ message: "State cannot be empty" });
      return;
    }

    if (userId == null) {
      res.redirect("/sign-in");
    } else {
      var sql =
        "INSERT INTO `shipping_information`(`user_id`,`fullname`,`mobile`,`pincode`,`house_address`, `colony_area`,landmark,city_town,state,created_at,updated_at) VALUES ('" +
        userId +
        "', '" +
        fullname +
        "', '" +
        mobile +
        "','" +
        pincode +
        "', '" +
        house_address +
        "', '" +
        colony_area +
        "', '" +
        landmark +
        "', '" +
        city_town +
        "', '" +
        state +
        "','" +
        today +
        "','" +
        today +
        "')";
      var query = db.query(sql, function (error, result) {
        if (error) {
          throw error;
        } else {
          if (membershipcheckout_shipping == 1) {
            req.flash(
              "message",
              "Your Shipping Information has been succefully added."
            );
            res.redirect("membership_checkout");
          } else {
            req.flash(
              "message",
              "Your Shipping Information has been succefully added."
            );
            res.redirect("checkout");
          }
        }
      });
    }
  }
};

exports.stripePayment = async (req, res, next) => {
  var post = req.body;
  var txtid = cryptr.decrypt(post.txnid);
  var paid_amount = cryptr.decrypt(post.paid_amount);
  var cartId = cryptr.decrypt(post.cartId);
  var today = new Date().toISOString().slice(0, 19).replace("T", " ");
  var userId = req.session.userId;
  if (userId == null) {
    res.redirect("/sign-in");
  } else if (txtid == "") {
    req.flash("errors", "Transaction id cannot be null.");
    res.redirect("checkout");
  } else if (cartId == "") {
    req.flash("errors", "Cart Id cannot be empty.");
    res.redirect("checkout");
  } else {
    var sql1 =
      "INSERT INTO `bk_order`(`cart_id`,`reference`,`paid_amount`,`customer_id`,`payment_method`,created_at,updated_at) VALUES ('" +
      cartId +
      "','" +
      txtid +
      "', '" +
      paid_amount +
      "', '" +
      userId +
      "','" +
      1 +
      "','" +
      today +
      "','" +
      today +
      "')";
    // console.log(sql1); return;
    var query = db.query(sql1, async function (error, result) {
      if (error) throw error;
      const orderId = result.insertId;

      var get_products =
        "select *, cart_product.quantity as cart_quantity from cart_product left join products on cart_product.product_id = products.id where cart_id='" +
        cartId +
        "'";
      var product_details = db.query(
        get_products,
        async function (err, product) {
          if (error) throw error;
          const cartProduct = product.map((data) => {
            const finalItemAmount = data.price * ((100 - data.discount) / 100);
            let prepareObject = {
              price_data: {
                currency: "inr",
                product_data: {
                  name: data.name,
                  // images: [`<%= process.env.IMAGE_URL %>unnamed.jpg`]
                },
                unit_amount:
                  parseInt(data.price * ((100 - data.discount) / 100)) * 100,
              },
              quantity: data.cart_quantity,
            };
            return prepareObject;
          });
          let finalArr = await Promise.resolve(cartProduct);
          const session = await stripe.checkout.sessions.create({
            success_url: `${URL}/payment_status?orderId=${orderId}&cartId=${cartId}&success=${true}`,
            cancel_url: `${URL}/payment_status?orderId=${orderId}&cartId=${cartId}&success=${false}`,
            payment_method_types: ["card"],
            line_items: finalArr,
            mode: "payment",
            client_reference_id: "You can use order id here",
          });
          console.log(session, "sessionsessionsession");
          var sql =
            "UPDATE bk_order SET `payment_gateway_id` ='" +
            session.id +
            "' WHERE `order_id` ='" +
            orderId +
            "'";
          var query = db.query(sql, function (error, updatecart) {
            if (error) throw error;
          });
          res.redirect(303, session.url);
        }
      );
    });
  }
};

exports.razorpayPaymentStatus = async (req, res, next) => {
  try {
    var post = req.body;
    var txtid = cryptr.decrypt(post.txnid);
    var paid_amount = cryptr.decrypt(post.paid_amount);
    var cartId = cryptr.decrypt(post.cartId);
    var today = new Date().toISOString().slice(0, 19).replace("T", " ");
    var userId = req.session.userId;

    if (!userId) {
      return res.redirect("/sign-in");
    }
    if (!txtid) {
      req.flash("errors", "Transaction id cannot be null.");
      return res.redirect("checkout");
    }
    if (!cartId) {
      req.flash("errors", "Cart Id cannot be empty.");
      return res.redirect("checkout");
    }

    // Insert order
    var sql1 =
      "INSERT INTO `bk_order`(`cart_id`,`reference`,`paid_amount`,`customer_id`,`payment_method`,created_at,updated_at) VALUES ('" +
      cartId +
      "','" +
      txtid +
      "', '" +
      paid_amount +
      "', '" +
      userId +
      "','" +
      1 +
      "','" +
      today +
      "','" +
      today +
      "')";
    db.query(
      sql1,
      [cartId, txtid, paid_amount, userId, 1, today, today],
      async (error, result) => {
        if (error) {
          console.error("Order Insert Error:", error);
          req.flash("message", "Error processing order. Please try again.");
          return res.redirect("/checkout");
        }
        const orderId = result.insertId;

        // Fetch cart products
        var get_products = `SELECT *, cart_product.quantity as cart_quantity
                                FROM cart_product
                                LEFT JOIN products ON cart_product.product_id = products.id
                                WHERE cart_id = ?`;
        db.query(get_products, [cartId], async (err, product) => {
          if (err) {
            console.error("Fetch Cart Products Error:", err);
            req.flash("message", "Error fetching cart products.");
            return res.redirect("/checkout");
          }

          let totalAmount = 0;

          // Calculate total amount
          product.forEach((data) => {
            let price = parseFloat(data.price || "0");
            let discount = parseFloat(data.discount || "0");
            let delivery_charge = parseFloat(data.delivery_charge || "0");
            let cart_quantity = parseInt(data.cart_quantity || "0");

            let discountedPrice = price * ((100 - discount) / 100);
            let finalPrice =
              (discountedPrice + delivery_charge) * cart_quantity;

            console.log(
              `Product: ${data.name}, Price: ${price}, Discount: ${discount}, Delivery: ${delivery_charge}, Quantity: ${cart_quantity}, Final Price: ${finalPrice}`
            );

            totalAmount += finalPrice;
          });

          console.log("Final Total Amount Before Payment:", totalAmount);
          totalAmount = Math.round(totalAmount * 100); // Convert to paise

          if (isNaN(totalAmount) || totalAmount <= 100) {
            console.error("Error: Invalid Total Amount!");
            req.flash(
              "message",
              "Invalid payment amount. Please check your cart."
            );
            return res.redirect("/addtocart");
          }

          const userMobile = req.session.user?.mobile;

          // Validate mobile number (10 digits, starts with 6-9)
          const isValidMobile = userMobile && /^[6-9]\d{9}$/.test(userMobile);

          if (!isValidMobile) {
            req.flash(
              "errors",
              "Invalid mobile number. Please update your profile."
            );
            return res.redirect("/profile"); // Redirect user to update mobile number
          }
          // Razorpay payment options
          var options = {
            amount: totalAmount,
            currency: "INR",
            callback_url: `${URL}/payment_status?orderId=${orderId}&cartId=${cartId}&success=true`,
            callback_method: "get",
            description: "Books",
            customer: {
              name: req.session.user?.name || "Customer",
              email: req.session.user?.email || "no-email@example.com",
              contact: userMobile,
            },
            notify: {
              sms: true,
              email: false,
            },
          };

          console.log("Payment Options:", JSON.stringify(options, null, 2));

          // Create Razorpay payment link
          instance.paymentLink
            .create(options)
            .then((dataMain) => {
              var sql =
                "UPDATE bk_order SET payment_gateway_id = ? WHERE order_id = ?";
              db.query(
                sql,
                [dataMain.id, orderId],
                function (error, updatecart) {
                  if (error) {
                    console.error("Payment Gateway ID Update Error:", error);
                  }
                }
              );
              res.redirect(dataMain.short_url);
            })
            .catch((err) => {
              console.error("Payment Link Creation Error:", err);
              console.error("❌ Error Message:", err.message);
              console.error("📌 Error Details:", JSON.stringify(err, null, 2));
              req.flash(
                "errors",
                err.message || "Error creating payment link."
              );
              res.redirect("/addtocart");
            });
        });
      }
    );
  } catch (err) {
    console.error("Unexpected Error:", err);
    req.flash("errors", err.message || "Unexpected error occurred.");
    res.redirect("/addtocart");
  }
};

// exports.razorpayPaymentStatus = async (req, res, next) => {
//     var post = req.body;
//     var txtid = cryptr.decrypt(post.txnid);
//     var paid_amount = cryptr.decrypt(post.paid_amount);
//     var cartId = cryptr.decrypt(post.cartId);
//     var today = new Date().toISOString().slice(0, 19).replace('T', ' ');
//     var userId = req.session.userId;
//     if (userId == null) {
//         res.redirect('/sign-in');
//     } else if (txtid == "") {
//         req.flash('errors', 'Transaction id cannot be null.');
//         res.redirect('checkout');
//     } else if (cartId == "") {
//         req.flash('errors', 'Cart Id cannot be empty.');
//         res.redirect('checkout');
//     } else {
//         var sql1 = "INSERT INTO `bk_order`(`cart_id`,`reference`,`paid_amount`,`customer_id`,`payment_meˀthod`,created_at,updated_at) VALUES ('" + cartId + "','" + txtid + "', '" + paid_amount + "', '" + userId + "','" + 1 + "','" + today + "','" + today + "')";
//         // console.log(sql1); return;
//         db.query(sql1, async function (error, result) {
//             if (error) throw error;
//             const orderId = result.insertId;

//             var get_products = "select *, cart_product.quantity as cart_quantity from cart_product left join products on cart_product.product_id = products.id where cart_id='" + cartId + "'";
//             db.query(get_products, async function (err, product) {
//                 if (err) throw error;
//                 let totalAmount = 0;
//                 const cartProduct = product.map(data => {
//                     //     totalAmount += (((parseFloat(data.price * ((100 - data.discount) / 100)) * 100))+parseFloat(data.delivery_charge)) * parseInt(data.cart_quantity)
//                     totalAmount += (
//                         ((parseFloat(data.price ?? 0) * ((100 - parseFloat(data.discount ?? 0)) / 100)) + parseFloat(data.delivery_charge ?? 0))
//                         * parseInt(data.cart_quantity ?? 0)
//                     );
//                 })
//                 await Promise.resolve(cartProduct)
//                 var options = {
//                     // upi_link: false,
//                     amount: Math.round(totalAmount * 100), // Ensure it's an integer
//                     currency: "INR",
//                     // receipt: orderId,
//                     callback_url: `${URL}/payment_status?orderId=${orderId}&cartId=${cartId}&success=${true}`,
//                     callback_method: "get",
//                     description: "Books",
//                     customer: {
//                         name: req.session.user.name,
//                         email: req.session.user.email,
//                         contact: req.session.user.mobile
//                     },
//                     notify: {
//                         sms: true,
//                         email: false
//                     },
//                 }

//                 instance.paymentLink.create({
//                     ...options
//                 }).then((dataMain) => {
//                     var sql = "UPDATE bk_order SET `payment_gateway_id` ='" + dataMain.id + "' WHERE `order_id` ='" + orderId + "'";
//                     db.query(sql, function (error, updatecart) {
//                         if (error) throw error
//                     })
//                     res.redirect(dataMain.short_url)
//                 }).catch(err => {
//                     console.error("Payment Link Creation Error:", err);

//                     // Check if err is an array and extract the first error message
//                     let errorMessage = err.message || (Array.isArray(err) ? JSON.stringify(err[0], null, 2) : JSON.stringify(err, null, 2));

//                     req.flash('message', errorMessage); // Store human-readable error
//                     res.redirect('/addtocart');
//                 });

//             });
//         });
//     }
// }

exports.orderPaymentStatus = (req, res, next) => {
  const orderId = req.query.orderId;
  const status = req.query.success;
  const cartId = req.query.cartId;

  if (status) {
    var update_cart =
      "UPDATE `cart` SET status='1' WHERE cart_id = '" + cartId + "'";
    var query = db.query(update_cart, function (error, results) {
      if (error) throw error;
    });
  }
  const payment_gateway_status = status ? "success" : "failure";

  var sqlQuery = "select * from bk_order WHERE `order_id` ='" + orderId + "'";
  let orderSMS = false;
  db.query(sqlQuery, async function (error, orderData) {
    if (error) throw error;

    //const url = `${URL}/user/vieworder/${orderData[0].reference}`
    //const bodyContent = "Hello "+req.session.user.name+" \n Your order id : "+orderData[0].order_id+" \n View order: "+url+" \n Thanks for order!"

    const url = `${req.protocol}://${req.headers.host}/user/vieworder/${orderData[0].reference}`;
    const bodyContent =
      "Sriina: Dear, " +
      req.session.user.name +
      " Thank you for your purchase! We are getting your order: " +
      orderData[0].reference +
      " view order " +
      url +
      " ready to shipped and will notify you when it has been sent";
    const emailBody =
      "Thank you so much for your order! We will get started on your order Right away. When we ship your order, we will send an email. \n\nIn the mean time, if any questions arise please do not hesitate to contact us we will always be happy to help.";

    if (req.session.user.mobile) {
      await client.messages
        .create({
          body: bodyContent,
          from: "+15627849373",
          to: "+91" + req.session.user.mobile,
        })
        .then((message) => {
          orderSMS = true;
          console.log("twilio message -->", message);
        })
        .catch((error) => {
          orderData = false;
          console.log("twilio error -->", error);
        });
    }
    if (req.session.user.email) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      var mailOptions = {
        from: "sriinaonlinepvtltd@gmail.com",
        to: req.session.user.email,
        subject: "Order confirmation",
        text: emailBody,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Cannot connect to server email error.", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }

    var sql =
      "UPDATE bk_order SET `payment_gateway_status` ='" +
      payment_gateway_status +
      "' WHERE `order_id` ='" +
      orderId +
      "'";
    var query = db.query(sql, function (error, updatecart) {
      if (error) throw error;
      if (!orderSMS)
        req.flash(
          "errors",
          "Your register mobile number wrong! So, not able to send order conformation SMS"
        );
      if (orderSMS)
        req.flash("message", "Order conformation SMS send successfully");
      req.flash("message", "Your Order has been successfully placed.");
      res.redirect("/addtocart");
    });
  });
};

exports.confimOrder = (req, res, next) => {
  var today = new Date().toISOString().slice(0, 19).replace("T", " ");
  var fs = require("fs");
  const ejs = require("ejs");
  var userId = req.session.userId;
  if (userId == null) {
    res.redirect("/sign-in");
  } else {
    if (req.method == "POST") {
      var post = req.body;
      var txtid = cryptr.decrypt(post.txnid);
      var paid_amount = cryptr.decrypt(post.paid_amount);
      var payment_method = xss(post.payment_method);
      var cartId = cryptr.decrypt(post.cartId);
      //console.log(post); return;
      // if (req.body.captchaText != captchaText) {
      //     req.flash('errors','Captcha verification does not match.');
      //     res.redirect('checkout');
      // }
      if (txtid == "") {
        req.flash("errors", "Transaction id cannot be null.");
        res.redirect("checkout");
      } else if (cartId == "") {
        req.flash("errors", "Cart Id cannot be empty.");
        res.redirect("checkout");
      } else {
        var sql1 =
          "INSERT INTO `bk_order`(`cart_id`,`reference`,`paid_amount`,`customer_id`,`payment_method`,created_at,updated_at) VALUES ('" +
          cartId +
          "','" +
          txtid +
          "', '" +
          paid_amount +
          "', '" +
          userId +
          "','" +
          payment_method +
          "','" +
          today +
          "','" +
          today +
          "')";
        //console.log(sql1); return;
        var query = db.query(sql1, function (error, result) {
          if (error) throw error;

          var sql =
            "UPDATE `cart` SET status=1 WHERE cart_id='" +
            cartId +
            "' and user_id='" +
            userId +
            "'";
          var query = db.query(sql, function (error, updatecart) {
            if (error) throw error;
            var user_plan =
              "UPDATE user_plan SET status=1, payment_method='2' WHERE order_id='" +
              txtid +
              "'";
            var query = db.query(user_plan, function (error, updatepnal) {
              if (error) {
                console.log("Something went wrong please try again.");
              } else {
                var sqlQuery =
                  "select * from bk_order WHERE `order_id` ='" +
                  result.insertId +
                  "'";
                let orderSMS = false;
                db.query(sqlQuery, async function (error, orderData) {
                  if (error) throw error;

                  /* Order confirmation SMS */
                  const url = `${req.protocol}://${req.headers.host}/user/vieworder/${orderData[0].reference}`;
                  const bodyContent =
                    "Sriina: Dear, " +
                    req.session.user.name +
                    " Thank you for your purchase! We are getting your order: " +
                    orderData[0].reference +
                    " view order " +
                    url +
                    " ready to shipped and will notify you when it has been sent";
                  //console.log("mobile no ======================>",req.session.user.mobile);
                  if (req.session.user.mobile) {
                    await client.messages
                      .create({
                        body: bodyContent,
                        from: "+15627849373",
                        to: "+91" + req.session.user.mobile,
                      })
                      .then((message) => {
                        orderSMS = true;
                        console.log("twilio message -->", message);
                      })
                      .catch((error) => {
                        orderData = false;
                        console.log("twilio error -->", error);
                      });
                  }

                  /* Order confirmation mail */
                  let user_query =
                    "SELECT `name`,`email` FROM `users` WHERE id='" +
                    userId +
                    "'";
                  let get_query = db.query(
                    user_query,
                    function (error, userquerys) {
                      let get_products =
                        "SELECT products.name,products.price,products.discount,cart_product.cart_id,cart_product.product_id,cart_product.on_rental,sum(cart_product.quantity) as cartquantity, `cart`.cart_id as CartId,`cart`.user_id,`cart`.status FROM products LEFT JOIN cart_product ON products.id = cart_product.product_id LEFT JOIN cart ON cart_product.cart_id = cart.cart_id where cart.status='1' AND cart.user_id='" +
                        userId +
                        "' and cart.`cart_id`='" +
                        cartId +
                        "' group by product_id";
                      let get_data = db.query(
                        get_products,
                        function (error, get_orders) {
                          if (error) throw error;
                          //console.log('email content data -->', get_orders);
                          let mail_data = JSON.parse(
                            JSON.stringify(get_orders)
                          );
                          ejs.renderFile(
                            "./views/emails/order_confirmed.ejs",
                            {
                              username: userquerys[0].name,
                              get_orders: mail_data,
                            },
                            function (err, data) {
                              if (err) {
                                console.log(
                                  "email error ======================>",
                                  err
                                );
                              } else {
                                const mailTransport =
                                  nodemailer.createTransport({
                                    // host: "smtpout.secureserver.net",
                                    host: "smtp.gmail.com",
                                    secure: true,
                                    secureConnection: false, // TLS requires secureConnection to be false
                                    tls: {
                                      ciphers: "SSLv3",
                                    },
                                    requireTLS: true,
                                    port: 465,
                                    debug: true,
                                    auth: {
                                      user: "ordersriina@gmail.com",
                                      pass: "tzhgntwdqnltwxjn",
                                    },
                                  });

                                const mailOptions = {
                                  from:
                                    "Sriina Online " + "ordersriina@gmail.com",
                                  to: userquerys[0].email,
                                  cc: "ordersriina@gmail.com",
                                  subject:
                                    "Your order has been placed successfully",
                                  html: data,
                                };

                                mailTransport
                                  .sendMail(mailOptions)
                                  .then(() => {
                                    console.log("Email sent successfully");
                                  })
                                  .catch((err) => {
                                    console.log("Failed to send email");
                                    console.error(err);
                                  });
                                /* var transporter = nodemailer.createTransport({
                                                         service: 'gmail',
                                                         auth: {
                                                             user: process.env.EMAIL_USERNAME,
                                                             pass: process.env.EMAIL_PASSWORD,
                                                         }
                                                     });

                                                     var mainOptions = {
                                                         from: 'no-reply@gmail.com',
                                                         to: userquerys[0].email,
                                                         subject: 'Your order has been placed successfully',
                                                         html: data
                                                     };
                                                     transporter.sendMail(mainOptions, function (err, info) {
                                                         if (err) {
                                                             console.log(err);
                                                         } else {
                                                             console.log('Message sent: ' + info.response);
                                                         }
                                                     });*/
                              }
                            }
                          );

                          if (!orderSMS)
                            req.flash(
                              "errors",
                              "Your register mobile number wrong! So, not able to send order conformation SMS"
                            );
                          if (orderSMS)
                            req.flash(
                              "message",
                              "Order conformation SMS send successfully"
                            );
                          req.flash(
                            "message",
                            "Your order has been successfully placed."
                          );
                          res.redirect("/myaccount");
                        }
                      );
                    }
                  );
                });
              }
            });
          });
        });
      }
    }
  }
};

exports.PrimeConfimOrder = (req, res, next) => {
  var today = new Date().toISOString().slice(0, 19).replace("T", " ");
  if (req.method == "POST") {
    var user = req.session.user,
      userId = req.session.userId;
    var post = req.body;
    var txnid = xss(post.txnid);
    var pay_amount = xss(post.pay_amount);
    if (req.body.captchaText != captchaText) {
      req.flash("message", "Captcha verification does not match.");
      res.redirect("membership_checkout");
    } else if (userId == null) {
      res.redirect("/sign-in");
    } else {
      var userData =
        "SELECT `plans`.total_month,`user_plan`.created_at as planDate,`user_plan`.status FROM `user_plan` LEFT JOIN `plans` ON `user_plan`.plan_id = `plans`.id WHERE `user_plan`.order_id='" +
        txnid +
        "' and `user_plan`.status='0' ";
      var query = db.query(userData, function (error, results) {
        let expired_date = results[0].total_month;
        let plan_buy_date = results[0].planDate;
        let futureMonth = moment(plan_buy_date)
          .add(expired_date, "M")
          .format("YYYY-MM-DD h:mm:ss");
        if (results) {
          var sql1 =
            "UPDATE `user_plan` SET `paid_amount`='" +
            pay_amount +
            "', `payment_method`='2', status='1', expired_date = '" +
            futureMonth +
            "' WHERE order_id = '" +
            txnid +
            "' and user_id='" +
            userId +
            "' ";
          var mysql = db.query(sql1, function (error, getupdateplan) {
            if (error) throw error;
            req.flash(
              "message",
              "Sriina online prim membership has been successfully done your application."
            );
            res.redirect("/sritezprime");
          });
        }
      });
    }
  }
};

exports.razorpayMembershipPayment = async (req, res, next) => {
  if (req.method == "POST") {
    var user = req.session.user,
      userId = req.session.userId;
    var post = req.body;
    var txnid = xss(post.txnid);
    var pay_amount = xss(post.pay_amount);

    console.log("txnid --->", txnid);
    console.log("pay_amount --->", pay_amount);

    var today = new Date().toISOString().slice(0, 19).replace("T", " ");
    if (userId == null) {
      res.redirect("/sign-in");
    } else if (txnid == "") {
      req.flash("errors", "Transaction id cannot be null.");
      res.redirect("membership");
    } else {
      var userData =
        "SELECT `plans`.total_month,`user_plan`.created_at as planDate,`user_plan`.status FROM `user_plan` LEFT JOIN `plans` ON `user_plan`.plan_id = `plans`.id WHERE `user_plan`.order_id='" +
        txnid +
        "' and `user_plan`.status='0' ";
      const plan = db.query(userData, async function (err, planData) {
        if (err) throw err;
        totalAmount = parseInt(pay_amount * 100);
        console.log("planData ---->", planData);
        var options = {
          // upi_link: false,
          amount: totalAmount,
          currency: "INR",
          callback_url: `${URL}/payment_membership_status?orderId=${txnid}&success=${true}`,
          callback_method: "get",
          description: "Membership plan",
          customer: {
            name: req.session.user.name,
            email: req.session.user.email,
            contact: req.session.user.mobile,
          },
          notify: {
            sms: true,
            email: false,
          },
        };

        instance.paymentLink
          .create({
            ...options,
          })
          .then((dataMain) => {
            console.log("dataMain ---->", dataMain);
            let expired_date = planData[0].total_month;
            let plan_buy_date = planData[0].planDate;
            let futureMonth = moment(plan_buy_date)
              .add(expired_date, "M")
              .format("YYYY-MM-DD h:mm:ss");
            if (planData) {
              var sql1 =
                "UPDATE `user_plan` SET `paid_amount`='" +
                pay_amount +
                "', `payment_method`='1', `payment_gateway_id` ='" +
                dataMain.id +
                "', expired_date = '" +
                futureMonth +
                "' WHERE order_id = '" +
                txnid +
                "' and user_id='" +
                userId +
                "' ";
              var planQuery = db.query(sql1, function (error, getupdateplan) {
                if (error) throw error;
              });
            }
            res.redirect(dataMain.short_url);
          })
          .catch((err) => {
            console.log("err ---->", err);
            req.flash("message", err);
            res.redirect("/membership");
          });
      });
    }
  }
};

exports.membershipPaymentStatus = (req, res, next) => {
  const orderId = req.query.orderId;
  const status = req.query.success;

  if (status) {
    var update_cart =
      "UPDATE `user_plan` SET status='1' WHERE order_id = '" + orderId + "'";
    var query = db.query(update_cart, function (error, results) {
      if (error) throw error;
    });
  }
  const payment_gateway_status = status ? "success" : "failure";

  var sqlQuery =
    "select `plans`.`plan_name`, `plans`.`plan_price`, `plans`.`total_month`, `user_plan`.`order_id`, `user_plan`.`expired_date` from user_plan LEFT JOIN `plans` ON `user_plan`.plan_id = `plans`.id WHERE `user_plan`.order_id='" +
    orderId +
    "'";
  let orderSMS = false;
  db.query(sqlQuery, async function (error, orderData) {
    if (error) throw error;

    const url = `${URL}/sritezprime`;
    const bodyContent =
      "Hello " +
      req.session.user.name +
      " \n Your order id : " +
      orderData[0].order_id +
      " \n View order: " +
      url +
      " \n Membership plan: " +
      orderData[0].plan_name +
      " \n Thanks for membership!";
    if (req.session.user.mobile) {
      await client.messages
        .create({
          body: bodyContent,
          from: "+15627849373",
          to: "+91" + req.session.user.mobile,
        })
        .then((message) => {
          orderSMS = true;
          console.log("twilio message -->", message);
        })
        .catch((error) => {
          orderData = false;
          console.log("twilio error -->", error);
        });
    }

    var sql =
      "UPDATE user_plan SET `payment_gateway_status` ='" +
      payment_gateway_status +
      "' WHERE `order_id` ='" +
      orderId +
      "'";
    var query = db.query(sql, function (error, updatecart) {
      if (error) throw error;
      if (!orderSMS)
        req.flash(
          "errors",
          "Your register mobile number wrong! So, not able to send order conformation SMS"
        );
      if (orderSMS)
        req.flash("message", "Membership conformation SMS send successfully");
      req.flash(
        "message",
        "Sriina online prim membership has been successfully done your application."
      );
      res.redirect("/sritezprime");
    });
  });
};

exports.forgotPassword = (req, res, next) => {
  if (req.method == "GET") {
    // let sql2 = "SELECT * from books_category where is_deleted=0";
    // let query = db.query(sql2, function (error, getcategory) {
    res.render("front/forgot_password.ejs", {
      categorylist: [],
      title: "Forgot Password",
      csrfToken: req.csrfToken(),
      message: req.flash("message"),
    });
    // });
  }
};

exports.forgotPwd = (req, res, next) => {
  var nodemailer = require("nodemailer");
  if (req.method == "POST") {
    var post = req.body;
    var today = new Date().toISOString().slice(0, 19).replace("T", " ");
    var username = post.username;
    // var sql = "SELECT name,email,mobile FROM `users` WHERE `email`='" + username + "' and `type`= '" + 0 + "'";
    var sql =
      "SELECT name, email, mobile FROM `users` WHERE `email`='" +
      username +
      "' AND `type` IN (0, 1)";

    // console.log(sql);
    db.query(sql, function (err, results) {
      if (results.length > 0) {
        var otp = Math.floor(100000 + Math.random() * 900000);
        let mobile = results[0].mobile;
        var transporter = nodemailer.createTransport({
          service: "gmail",
          /*secure: true,
                    port: 465,*/
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          } /*,tls: {
                        rejectUnauthorized: false
                    }*/,
        });

        let msg =
          "Hi " +
          results[0].name +
          ", \nYour forgot password otp is. " +
          otp +
          "  \nThanks Sriina Team";

        var mailOptions = {
          from: "sriinaonlinepvtltd@gmail.com",
          to: username,
          subject: "Forgot Password OTP",
          text: msg,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            req.flash(
              "message",
              "We are sorry we're not able to identify you given the information provided."
            );
            res.redirect("forgot-password");
          } else {
            //console.log('Email sent: ' + info.response);
            var sql =
              "UPDATE users SET otp='" +
              otp +
              "', modifiedby='" +
              today +
              "' WHERE email='" +
              username +
              "'";
            var query = db.query(sql, function (error, updateusers) {
              if (error) throw error;
              req.session.sessionEmail = username;
              req.flash(
                "message",
                "OTP sent to your registered email id and also check all folder. "
              );
              res.redirect("verifyotp");
            });
          }
        });
      } else {
        req.flash(
          "message",
          "We are sorry we're not able to identify you given the information provided."
        );
        res.redirect("forgot-password");
      }
    });
  }
};
/*exports.forgotPwd = (req, res, next)=>{

     if(req.method == "POST"){
        var post  = req.body;
        var today = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var username = xss(post.username);
        var sql ="SELECT name,email FROM `users` WHERE `email`='"+username+"' and `type`= '"+0+"'";

            db.query(sql, function(err, results){
                if(results.length>0){
                var otp = Math.floor(100000 + Math.random() * 900000);

                var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'sriinaonlinepvtltd@gmail.com',
                    pass: '*5xT@K812'
                  }
                });

                let msg = 'Hi '+results[0].name+',  \nYour forgot password OTP is. '+ otp +'  \nThanks Sriina Team';

                var mailOptions = {
                  from: 'sriinaonlinepvtltd@gmail.com',
                  to: username,
                  subject: 'Forgot Password OTP',
                  text: msg,
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                var sql = "UPDATE users SET otp='"+otp+"', modifiedby='"+today+"' WHERE email='"+ username +"'";
                var query = db.query(sql, function(error, updateusers){
                    if(error) throw error;
                    req.session.sessionEmail = username;
                    req.flash('message','OTP sent to your registered email address and also check spam folder.');
                    res.redirect('verifyotp');
                });

                } else {
                    req.flash("message","We are sorry we're not able to identify you given the information provided.");
                    res.redirect('forgot-password');
                }
            });
    }
}*/

exports.otpVerify = (req, res, next) => {
  if (req.method == "GET") {
    let sql2 = "SELECT * from books_category where is_deleted=0";
    let query = db.query(sql2, function (error, getcategory) {
      res.render("front/verifyotp", {
        categorylist: getcategory,
        title: "Verify OTP",
        csrfToken: req.csrfToken(),
        message: req.flash("message"),
      });
    });
  }
};

exports.verifiedOTP = (req, res, next) => {
  if (req.method == "POST") {
    var post = req.body;
    var otp = xss(post.otp);
    //console.log(otp); return;
    var sql =
      "SELECT otp FROM `users` WHERE `email`='" +
      req.session.sessionEmail +
      "' and `type`= '" +
      0 +
      "'";
    //console.log(sql);
    var query = db.query(sql, function (error, getrows) {
      if (error) throw error;
      if (getrows.length > 0) {
        if (otp == getrows[0].otp) {
          res.redirect("resetpwd");
        } else {
          req.flash("message", "The OTP entered is incorrect.");
          res.redirect("verifyotp");
        }
      } else {
        req.flash("message", "Something went wrong. Please try again later.");
        res.redirect("verifyotp");
      }
    });
  }
};

exports.resetPWD = (req, res, next) => {
  if (req.method == "GET") {
    let sql2 = "SELECT * from books_category where is_deleted=0";
    let query = db.query(sql2, function (error, getcategory) {
      res.render("front/resetpwd", {
        categorylist: getcategory,
        title: "Reset Password",
        csrfToken: req.csrfToken(),
        message: req.flash("message"),
      });
    });
  }
};

exports.resetPwdSave = (req, res, next) => {
  if (req.method == "POST") {
    var post = req.body;
    var password = xss(post.password);
    var confirm_password = xss(post.confirm_password);
    var hash = bcrypt.hashSync(password, 10);
    //console.log(otp); return;
    var sql =
      "SELECT email FROM `users` WHERE `email`='" +
      req.session.sessionEmail +
      "' and `type`='" +
      0 +
      "'";
    //console.log(sql); return;
    var query = db.query(sql, function (error, getrows) {
      if (error) throw error;

      if (getrows.length > 0) {
        if (password != confirm_password) {
          req.flash("message", "Password and confirm password does not match.");
          res.redirect("resetpwd");
        } else if (password <= 5) {
          req.flash(
            "message",
            "You have entered less than 5 characters for password"
          );
          res.redirect("resetpwd");
        } else {
          var sqlpwd =
            "UPDATE `users` SET password='" +
            hash +
            "' WHERE `email`='" +
            getrows[0].email +
            "'";
          var mysql = db.query(sqlpwd, function (error, updatepwd) {
            if (error) {
              throw error;
            } else {
              req.flash(
                "message",
                "Your password has been changed successfully! Thank you"
              );
              res.redirect("sign-in");
            }
          });
        }
      } else {
        req.flash("message", "Something went wrong. Please try again later.");
        res.redirect("resetpwd");
      }
    });
  }
};

exports.registerUserPlan = (req, res, next) => {
  if (req.method == "POST") {
    var today = new Date().toISOString().slice(0, 19).replace("T", " ");
    const pay = req.body;
    var plan_id = xss(pay.plan_id);
    var userId = req.session.userId;
    var sqlUserData = "SELECT * FROM `users` WHERE id='" + userId + "'";
    var query = db.query(sqlUserData, function (error, getuserData) {
      var sqlplan =
        "SELECT `plan_id` from `user_plan` WHERE `user_id` = '" +
        userId +
        "' AND `status`='1' ";
      var query = db.query(sqlplan, function (error, get_plans) {
        if (userId == null) {
          res.redirect("/sign-in");
        } else if (get_plans.length > 0) {
          res.redirect("sritezprime");
        } else {
          var orderId = Math.floor(10000000 + Math.random() * 90000000);
          orderId = "STZ" + orderId;
          var insert_plan =
            "INSERT INTO `user_plan`(order_id,plan_id,user_id,status,created_at) VALUES('" +
            orderId +
            "','" +
            plan_id +
            "','" +
            userId +
            "','0','" +
            today +
            "')";
          var query = db.query(insert_plan, function (error, plan_results) {
            if (error) throw error;
            res.redirect("membership_checkout");
          });
        }
      });
    });
  }
};

exports.membershipCheckout = (req, res, next) => {
  var userId = req.session.userId;
  if (userId == null) {
    res.redirect("sign-in");
  } else {
    var svgTag = getCaptcha().data;
    var SQL_RENT_STATE =
      "SELECT * FROM state_on_rent WHERE status='1' ORDER BY name";
    var query = db.query(SQL_RENT_STATE, function (error, prime_rent_state) {
      if (error) throw error;
      var SQL =
        "SELECT `shipping_information`.*,`state`.name as ShippingState, `country`.name as shippingCountyName FROM `shipping_information` LEFT JOIN `state` ON `shipping_information`.state = `state`.id LEFT JOIN `country` ON `state`.countryid = `country`.id WHERE shipping_information.`user_id`='" +
        userId +
        "' ";
      var query = db.query(SQL, function (error, getshipping) {
        if (error) throw error;
        var SQL =
          "SELECT `billing_information`.*,`state`.name as ShippingState, `country`.name as billingCountyName FROM `billing_information` LEFT JOIN `state` ON `billing_information`.state = `state`.id LEFT JOIN `country` ON `state`.countryid = `country`.id WHERE billing_information.`user_id`='" +
          userId +
          "' ";
        var query = db.query(SQL, function (error, getbilling) {
          if (error) throw error;

          var userData =
            "SELECT `plans`.plan_price,`user_plan`.plan_id,`user_plan`.order_id FROM `user_plan` LEFT JOIN `plans` ON `user_plan`.plan_id = `plans`.id WHERE `user_plan`.user_id='" +
            userId +
            "' and `user_plan`.status='0' ";
          //console.log(userData); return;
          var query = db.query(userData, function (error, getPlanData) {
            if (error) throw error;
            var getresult = getPlanData[0];
            var planPrice = getresult.plan_price;
            var txnid = getresult.order_id;
            //onsole.log(getresult.plan_price); return;
            var sql = "SELECT * FROM users WHERE id='" + userId + "'";
            var query = db.query(sql, function (error, results) {
              if (error) throw error;
              res.render("shoppingcart/membership_checkout", {
                txnid: txnid,
                total: planPrice,
                result: results[0],
                message: req.flash("message"),
                captchaImage: svgTag,
                prime_rent_state: prime_rent_state,
                getshipping: getshipping,
                getbilling: getbilling,
                csrfToken: req.csrfToken(),
                getcartdata: "",
              });
            });
          });
        });
      });
    });
  }
};

exports.userContactUs = (req, res, next) => {
  let title = "Stitez Contact us";
  res.render("front/contactus.ejs", {
    title: title,
    csrfToken: req.csrfToken(),
    message: req.flash("message"),
    getcartdata: "",
  });
};

exports.userContactUsSave = (req, res, next) => {
  if (req.method == "POST") {
    var today = new Date().toISOString().slice(0, 19).replace("T", " ");
    const data = req.body;
    let name = data.name.trim();
    let email = data.email.trim();
    let mobile = data.mobile.trim();
    let subject = data.subject.trim();
    let message = data.message.trim();
    var contactus =
      "INSERT INTO `contactus`(name,email,phone,subject,message,created_at) VALUES('" +
      name +
      "','" +
      email +
      "','" +
      mobile +
      "','" +
      subject +
      "','" +
      message +
      "','" +
      today +
      "')";
    var query = db.query(contactus, function (error, plan_results) {
      if (error) throw error;
      req.flash(
        "message",
        "We appreciate you contacting us [ " +
          name +
          " ] One of our colleagues will get back in touch with you soon!"
      );
      res.redirect("contact-us");
    });
  }
};

exports.deleteShippingAddress = (req, res, next) => {
  var userId = req.session.userId;
  var shippingId = xss(req.query.shippingId);
  if (userId == null) {
    res.redirect("sign-in");
  } else {
    var sql =
      "DELETE FROM `shipping_information` WHERE `id` = '" +
      shippingId +
      "' and user_id='" +
      userId +
      "'";
    var query = db.query(sql, function (error, deletequery) {
      if (error) throw error;
      res.end('{"status": 1}');
    });
  }
};

exports.deleteBillingAddress = (req, res, next) => {
  var userId = req.session.userId;
  var billingId = xss(req.query.billingId);
  if (userId == null) {
    res.redirect("sign-in");
  } else {
    var sql =
      "DELETE FROM `billing_information` WHERE `id` = '" +
      billingId +
      "' and user_id='" +
      userId +
      "'";
    var query = db.query(sql, function (error, deletequery) {
      if (error) throw error;
      res.end('{"status": 1}');
    });
  }
};

exports.vendorRegister = (req, res, next) => {
  var svgTag = getCaptcha().data;
  res.render("users/vendor_register", {
    title: "Vendor Registration form",
    message: req.flash("message"),
    csrfToken: req.csrfToken(),
    captchaImage: svgTag,
  });
};

exports.vendorRegisterFrm = (req, res, next) => {
  if (req.method == "POST") {
    var today = new Date().toISOString().slice(0, 19).replace("T", " ");
    const data = req.body;
    let company_mail = xss(data.company_mail.trim().toLowerCase());
    let company_name = xss(data.company_name.trim().toLowerCase());
    let company_phone = xss(data.company_phone.trim().toLowerCase());
    let company_contact_person = xss(
      data.company_contact_person.trim().toLowerCase()
    );
    let company_contact_phone_no = xss(
      data.company_contact_phone_no.trim().toLowerCase()
    );
    let company_gst = xss(data.company_gst.trim().toLowerCase());
    let product_type = xss(data.vender_product_type.trim().toLowerCase());
    var pass = xss(data.password);
    const rounds = 10;
    var hash = bcrypt.hashSync(pass, rounds);

    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    if (!company_mail || company_mail.search(/\w/) < 0) {
      req.flash("message", "Company email id cannot be empty.");
      res.redirect("/vendor_register");
    } else if (!emailReg.test(company_mail)) {
      req.flash("message", "Please enter valid email address.");
      res.redirect("/vendor_register");
    } else if (!company_name || company_name.search(/\w/) < 0) {
      req.flash("message", "Company name cannot be empty.");
      res.redirect("/vendor_register");
    } else if (!company_phone || company_phone.search(/\w/) < 0) {
      req.flash("message", "Company phone number cannot be empty.");
      res.redirect("/vendor_register");
    } else if (
      !company_contact_person ||
      company_contact_person.search(/\w/) < 0
    ) {
      req.flash("message", "Company contact person cannot be empty.");
      res.redirect("/vendor_register");
    } else if (
      !company_contact_phone_no ||
      company_contact_phone_no.search(/\w/) < 0
    ) {
      req.flash("message", "Company contact person no. cannot be empty.");
      res.redirect("/vendor_register");
    } else if (!company_contact_phone_no.length == "10") {
      req.flash("message", "Mobile number lenght is short");
      res.redirect("/vendor_register");
    } else if (!pass || pass.search(/\w/) < 0) {
      req.flash("message", "Password cannot be empty.");
      res.redirect("/vendor_register");
    } else if (!pass.length > 5) {
      req.flash("message", "Password lenght should be 6 character long");
      res.redirect("/vendor_register");
    } else if (req.body.captchaText != captchaText) {
      req.flash("message", "Captcha verification does not match.");
      res.redirect("/vendor_register");
    } else {
      var sql =
        "SELECT `email`,`mobile` FROM `users` where `email`='" +
        company_mail +
        "' or `mobile`='" +
        company_phone +
        "'";
      var query = db.query(sql, function (error, result) {
        if (error) throw new Error("User Data Problem");
        if (result.length > 0) {
          req.flash(
            "message",
            "User already registered with same Email Id or Mobile"
          );
          res.redirect("/vendor_register");
        } else {
          let usertbl =
            "INSERT INTO `users`(name,email,mobile,password,type,status,createdby) VALUES('" +
            company_name +
            "','" +
            company_mail +
            "','" +
            company_phone +
            "','" +
            hash +
            "','3','1','" +
            today +
            "')";
          db.query(usertbl, function (error, datainserted) {
            let vendor =
              "INSERT INTO `vendor_info`(user_id,company_mail,company_name,company_phone,company_contact_person,company_contact_phone_no,company_gst,vender_product_type,created_at) VALUES('" +
              datainserted.insertId +
              "','" +
              company_mail +
              "','" +
              company_name +
              "','" +
              company_phone +
              "','" +
              company_contact_person +
              "','" +
              company_contact_phone_no +
              "', '" +
              company_gst +
              "', '" +
              product_type +
              "', '" +
              today +
              "')";
            let vendor_query = db.query(vendor, function (error, insertVendor) {
              var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "sriinaonlinepvtltd@gmail.com",
                  pass: "*5xT@K812",
                },
              });

              let msg =
                "Dear " +
                company_contact_person +
                ",\nWe appreciate you contacting us " +
                company_name +
                "One of our colleagues will get back in touch with you soon. \n \n \n Have great day \n Sriina Online Team";

              var mailOptions = {
                from: "sriinaonlinepvtltd@gmail.com",
                to: company_mail,
                subject: "Thank you for your registration!",
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

              req.flash(
                "message",
                "Your request has been sent to admin they will contact you soon."
              );
              res.redirect("/vendor_register");
            });
          });
        }
      });
    }
  }
};

exports.userLogout = (req, res, next) => {
  var message = "";
  req.session.destroy(function (err) {
    if (err) {
      throw error;
    } else {
      res.redirect("sign-in");
    }
  });
};

exports.errorPage = (req, res) => {
  let title = "error page";
  res.render("front/error_page", { title: title });
};

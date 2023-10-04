const jsSHA = require("jssha");
const request = require('request');
var payumoney = require('payumoney-node');
const moment = require('moment');
//const cons = require("consolidate");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
var nodemailer = require('nodemailer');

exports.payUMoney = function(req, res, next){
	if(req.method == "POST"){
		const pay = req.body;
		var txnid = cryptr.decrypt(pay.txnid);
		var cartid = cryptr.decrypt(pay.cartid);
		var today = new Date().toISOString().slice(0, 19).replace('T', ' ');
		var user =  req.session.user,
        userId = req.session.userId;
		//console.log(cartid); return;
        // if(userId==null){
        //     res.redirect('/sign-in');
		// }
		
		var sql = "INSERT INTO `bk_order`(`cart_id`,`reference`,`customer_id`,`payment_method`,`created_at`) VALUES('"+cartid+"','"+txnid+"','"+userId+"','1','"+today+"')";
		var query = db.query(sql, function(error,insertorder){
			if(error){
				throw (error);
			}
		});

        //const hashString = 'gtKFFx'+'|'+txnid+'|'+cryptr.decrypt(pay.amount)+'|'+pay.productinfo+'|'+cryptr.decrypt(pay.firstname)+'|'+cryptr.decrypt(pay.email)+'|||||||||||'+ 'eCwWELxi';
        const hashString = 'SRglBO'+'|'+txnid+'|'+cryptr.decrypt(pay.amount)+'|'+pay.productinfo+'|'+cryptr.decrypt(pay.firstname)+'|'+cryptr.decrypt(pay.email)+'|||||||||||'+ '4ms2o8Tj';

		const sha = new jsSHA('SHA-512', "TEXT");
		sha.update(hashString);
 		const hash = sha.getHash("HEX");
 	
		pay.key = 'SRglBO';
		pay.hash = hash;
		//pay.udf1 = pay.cartid;
		pay.txnid = txnid;
		pay.amount = cryptr.decrypt(pay.amount);
		pay.firstname = cryptr.decrypt(pay.firstname);
		pay.email = cryptr.decrypt(pay.email);
		pay.phone = cryptr.decrypt(pay.phone);
		pay.productinfo = pay.productinfo;
		pay.surl = 'https://sriina.com/payment/success';
		pay.furl = 'https://sriina.com/payment/failure';
		//console.log(pay); return;
		request.post({
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			//url: 'https://test.payu.in/_payment',
			url: 'https://secure.payu.in/_payment',
			form: pay
			}, function(error, httpRes, body){
				if (error)
					res.send({
						status: false,
						message:error.toString()
					});
				if (httpRes.statusCode === 200) {
					//console.log(body); return;
					res.send(body);
					
				} else if(httpRes.statusCode >= 300 && httpRes.statusCode <= 400){ //console.log(2); return;
					res.redirect(httpRes.headers.location.toString());
				}
			}
		);
	}
}

exports.PaymentSuccess = function(req, res, next){
	try { 
	if(req.method == "POST"){
		var payment_gateway_id = req.body.mihpayid;
		var payment_gateway_status = req.body.status;
		var gettxnid = req.body.txnid;
		var amount = req.body.amount;
		//console.log(req.body); return;
		var user =  req.session.user,
		userId = req.session.userId;
		
		//var sql = "UPDATE bk_order SET payment_gateway_status='"+payment_gateway_status+"', payment_gateway_id='"+payment_gateway_id+"' WHERE reference='"+gettxnid+"'";

		var sql = "UPDATE bk_order SET `paid_amount` ='"+amount+"', `payment_gateway_status` ='"+payment_gateway_status+"', `payment_gateway_id` ='"+payment_gateway_id+"' WHERE `reference` ='"+gettxnid+"'";
		var query = db.query(sql, function(error, updatecart){
			if(error){ throw (error);
			} else {
				let SQL_GET_USER_ID = "SELECT `cart_id`,`customer_id` FROM bk_order WHERE reference='"+gettxnid+"'";
				var query = db.query(SQL_GET_USER_ID,function(error, getuserId){
					if(error) throw error;
					var get_user_id = getuserId[0].customer_id;
					let get_cart_id = getuserId[0].cart_id;
					let user_query = "SELECT `name`,`email` FROM `users` WHERE id='"+get_user_id+"'";
					let get_query = db.query(user_query,function(error, userquerys){
						if(error) throw error;
					
							var transporter = nodemailer.createTransport({
								service: 'gmail',
								auth: {
									user: 'sriinaonlinepvtltd@gmail.com',
                                  	pass: '*5xT@K812'
								}
							});
			
							let msg = 'Dear '+userquerys[0].name+',\nThank you for your purchase from Sritz. Please let us know if we can do anything else to help!. \n \n \n Best Regards \n Sriina Team';

							var mailOptions = {
								from: 'sriinaonlinepvtltd@gmail.com',
								to: userquerys[0].email,
								subject: 'Thank You for Buying With Us',
								text: msg,
							};
			
							transporter.sendMail(mailOptions, function(error, info){
								if (error) {
									console.log(error);
								} else {
									console.log('Email sent: ' + info.response);
								}
							});
						var update_cart = "UPDATE `cart` SET status='1' WHERE user_id = '"+get_user_id+"'";
						var query = db.query(update_cart, function(error, results){
							if(error) throw error;
							var SQL_Query = "SELECT s.*, ss.name as StateName FROM `shipping_information` s LEFT JOIN `state` ss ON ss.id = s.state WHERE s.user_id = '"+get_user_id+"'";
							var query = db.query(SQL_Query, function(error, shipping_address){
								if(error) throw error;

								let get_products = "SELECT products.name,products.price,products.discount,cart_product.cart_id,cart_product.product_id,cart_product.on_rental,SUM(cart_product.quantity) as cartquantity, `cart`.cart_id as CartId,`cart`.user_id,`cart`.status FROM products LEFT JOIN cart_product ON products.id = cart_product.product_id LEFT JOIN cart ON cart_product.cart_id = cart.cart_id where cart.status='1' AND cart.user_id='"+get_user_id+"' and cart.`cart_id`= '"+get_cart_id+"' group by product_id";
								//console.log(get_products); return;
									var query = db.query(get_products, function(error, getrows){
										if(error) throw error;
										res.render('payment/success',{txnid:gettxnid,transctionId:payment_gateway_id,status:payment_gateway_status,amount:amount,delivery_address:shipping_address[0],getrows:getrows});
									});
								});
							});
						});
					});
				}
		});
	} else {
		res.render('payment/success');
	}
  } catch(e) {
    next(new CostControllException(e.message,e.stack));
  }
}

exports.PaymentFailure = function(req, res, next){
	try {
    //console.log('payment success body : '+ JSON.stringify(req.body)); return;
    //let redirectUrl = 'http://sriina.com/payment/failure';
	//res.redirect(redirectUrl);
	if(req.method == "POST"){
		var payment_gateway_id = req.body.mihpayid;
		var payment_gateway_status = req.body.status;
		var gettxnid = req.body.txnid;
		var amount = req.body.amount;

		var user =  req.session.user,
		userId = req.session.userId;
		
		var sql = "UPDATE bk_order SET payment_gateway_status='"+payment_gateway_status+"', payment_gateway_id='"+payment_gateway_id+"' WHERE reference='"+gettxnid+"'";
		var query = db.query(sql, function(error, updatecart){
			if(error){
				throw (error);
			} else {
				var update_cart = "UPDATE `cart` SET status='0' WHERE user_id = '"+userId+"'";
					var query = db.query(update_cart, function(){
						res.render('payment/failure',{txnid:gettxnid,transctionId:payment_gateway_id,status:payment_gateway_status,amount:amount
						});
				});
			}
		});
	}
  } catch(e) {
    next(new CostControllException(e.message,e.stack));
  }	
}


exports.primePayUMoney = (req, res, next)=>{
	if(req.method == "POST"){
		const pay = req.body;
		var txnid = pay.txnid;
		var cartid = pay.cartid;
		var today = new Date().toISOString().slice(0, 19).replace('T', ' ');
		var user =  req.session.user,
        userId = req.session.userId;
        const hashString = 'SRglBO'+'|'+txnid+'|'+pay.amount+'|'+pay.productinfo+'|'+pay.firstname+'|'+pay.email+'|||||||||||'+ '4ms2o8Tj';
		const sha = new jsSHA('SHA-512', "TEXT");
		sha.update(hashString);
 		const hash = sha.getHash("HEX");
 	
		pay.key = 'SRglBO';
		pay.hash = hash;
		//pay.udf1 = pay.cartid;
		pay.txnid = txnid;
		pay.amount = pay.amount;
		pay.firstname = pay.firstname;
		pay.email = pay.email;
		pay.phone = pay.phone;
		pay.productinfo = pay.productinfo;
		pay.surl = 'https://sriina.com/payment/membership_success';
        pay.furl = 'https://sriina.com/payment/membership_failure';
		//console.log(pay); return;
		request.post({
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			//url: 'https://test.payu.in/_payment',
			url: 'https://secure.payu.in/_payment',
			form: pay
			}, function(error, httpRes, body){
				if (error)
					res.send({
						status: false,
						message:error.toString()
					});
				if (httpRes.statusCode === 200) {
					//console.log(body); return;
					res.send(body);
					
				} else if(httpRes.statusCode >= 300 && httpRes.statusCode <= 400){ //console.log(2); return;
					res.redirect(httpRes.headers.location.toString());
				}
			}
		);
	}
}


exports.PaymentMembershipSuccess = function(req, res, next){
	try { 
	if(req.method == "POST"){
		var payment_gateway_id = req.body.mihpayid;
		var payment_gateway_status = req.body.status;
		var gettxnid = req.body.txnid;
		var amount = req.body.amount;
		var user =  req.session.user;
		userId = req.session.userId;
		
		var sql = "UPDATE `user_plan` SET `paid_amount` ='"+amount+"', `status` = '1', `payment_method`= '1', `payment_gateway_status` ='"+payment_gateway_status+"', `payment_gateway_id` ='"+payment_gateway_id+"' WHERE order_id='"+gettxnid+"'";
		var query = db.query(sql, function(error, updatecart){
			if(error) throw error;
			var userData = "SELECT `plans`.total_month,`user_plan`.created_at as planDate,`user_plan`.status FROM `user_plan` LEFT JOIN `plans` ON `user_plan`.plan_id = `plans`.id WHERE `user_plan`.order_id='"+gettxnid+"' and `user_plan`.status='1' ";
			//console.log(userData);
			var query = db.query(userData, function(error, results){
				if(error) throw error;
				let expired_date = results[0].total_month;
				let plan_buy_date = results[0].planDate;
				let futureMonth = moment(plan_buy_date).add(expired_date, 'M').format('YYYY-MM-DD h:mm:ss');
				if(results){
					var sql = "UPDATE `user_plan` SET `expired_date` ='"+futureMonth+"', `status` = '1', `payment_method`= '1', `payment_gateway_status` ='"+payment_gateway_status+"', `payment_gateway_id` ='"+payment_gateway_id+"' WHERE order_id='"+gettxnid+"'";
					var query = db.query(sql, function(error, updateExpireDate){
						res.render('payment/membership_success',{txnid:gettxnid,transctionId:payment_gateway_id,status:payment_gateway_status,amount:amount});
					});
				}
			});
		});
	} 
  } catch(e) {
    next(new CostControllException(e.message,e.stack));
  }
}

exports.PaymentMembershipFailure = function(req, res, next){
	try {
    //console.log('payment success body : '+ JSON.stringify(req.body)); return;
    //let redirectUrl = 'http://sriina.com/payment/membership_failure';
	//res.redirect(redirectUrl);
	if(req.method == "POST"){
		var payment_gateway_id = req.body.mihpayid;
		var payment_gateway_status = req.body.status;
		var gettxnid = req.body.txnid;
		var amount = req.body.amount;

		var user =  req.session.user,
		userId = req.session.userId;
		
		var sql = "UPDATE bk_order SET payment_gateway_status='"+payment_gateway_status+"', payment_gateway_id='"+payment_gateway_id+"' WHERE reference='"+gettxnid+"'";
		var query = db.query(sql, function(error, updatecart){
			if(error){
				throw (error);
			} else {
				var update_cart = "UPDATE `cart` SET status='0' WHERE user_id = '"+userId+"'";
					var query = db.query(update_cart, function(){
						res.render('payment/failure',{txnid:gettxnid,transctionId:payment_gateway_id,status:payment_gateway_status,amount:amount
						});
				});
			}
		});
	}
  } catch(e) {
    next(new CostControllException(e.message,e.stack));
  }	
}

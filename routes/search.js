exports.searchResult = (req, res, next) => {
	var xss = require("xss");
	var dateFormat = require('dateformat');
	let title = "Search result page";
	let keyword = xss(req.query.q);
	var newkey = keyword.replace(/'/g, "\\'");
	if(newkey!=null){
	var sql1 = "Select * from books_category where is_deleted=0";
	    var query = db.query(sql1, function(err, result) {
	       var sql2 = "SELECT p.* FROM products p JOIN (SELECT MAX(id) AS max_id FROM products WHERE status = 1 AND (`publisher` LIKE '%"+newkey+"%' OR `name` LIKE '%"+newkey+"%' OR `isbn` = '"+newkey+"' OR `isbn13` = '"+newkey+"' OR `author` LIKE '%"+newkey+"%' OR `description` LIKE '%"+newkey+"%') GROUP BY isbn13) latest_products ON p.id = latest_products.max_id ORDER BY p.id DESC LIMIT 1000";
		        var query = db.query(sql2, function(error, searchresult) {
				if(error){
					res.redirect('/errorPage');
				} else {
					res.render('front/searchview', {searchresult:searchresult,'title':title});
				}
	    	});
	    });
	} else {
		results = {}
		res.render('front/searchview');
	}
}

function convertDate(d) {
    var converted_date = dateFormat(d, "dd.mmm.yyyy")
    return converted_date;
}

exports.viewSearch = function(req, res, next){
	let Ids = req.params.id;
	let getSQL = "SELECT * FROM `blogs` where id='"+Ids+"'";
	db.query(getSQL, function(error, results){
		res.render('view_search_blog.ejs',{'results':results});
	});
}

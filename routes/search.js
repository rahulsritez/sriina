exports.searchResult = (req, res, next) => {
	var xss = require("xss");
	var dateFormat = require('dateformat');
	let title = "Search result page";
	let keyword = xss(req.query.q);
	var newkey = keyword.replace(/'/g, "\\'");
	if(newkey!=null){
	var sql1 = "Select * from books_category where is_deleted=0";
	    var query = db.query(sql1, function(err, result) {
	       var sql2 = "SELECT * FROM `products` WHERE  status=1 and (`publisher` LIKE '%"+newkey+"%' or `name` LIKE '%"+newkey+"%' or `isbn` ='"+newkey+"' or `isbn13` ='"+newkey+"' or `author` ='%"+newkey+"%') ORDER BY id DESC";
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
exports.searchResult = (req, res, next) => {
	var xss = require("xss");
	var dateFormat = require('dateformat');
	let title = "Search result page";
	let keyword = xss(req.query.q);
	var newkey = keyword.replace(/'/g, "\\'").trim();
	if(newkey!=null){
	var sql1 = "Select * from books_category where is_deleted=0";

		const searchInput = newkey.trim();
		const keywords = searchInput.split(' ');
		keywords.push(newkey.replace(/\s+/g, ""));

		const likeConditions = keywords.map(() => `
			publisher LIKE CONCAT('%', ?, '%') OR 
			name LIKE CONCAT('%', ?, '%') OR 
			isbn LIKE CONCAT('%', ?, '%') OR 
			REGEXP_REPLACE(isbn13, '[^a-zA-Z0-9]', '') LIKE REGEXP_REPLACE(?, '[^a-zA-Z0-9]', '') OR 
			author LIKE CONCAT('%', ?, '%') OR 
			description LIKE CONCAT('%', ?, '%')
			`).join(' OR ');

		const sql2 = `
			SELECT p.*
			FROM products p
			JOIN (
				SELECT MAX(id) AS max_id
				FROM products
				WHERE status = 1 AND (${likeConditions})
				GROUP BY isbn13
			) latest_products ON p.id = latest_products.max_id
			ORDER BY p.id DESC
			LIMIT 1000;
		`;

		const params = keywords.flatMap(k => [k, k, k, k, k, k]);

		db.query(sql2, params, function (error, searchresult) {
			if (error) {
				res.redirect('/errorPage');
			} else {
				res.render('front/searchview', { searchresult: searchresult, 'title': title });
			}
		});

	    //    var sql2 = "SELECT p.* FROM products p JOIN (SELECT MAX(id) AS max_id FROM products WHERE status = 1 AND (`publisher` LIKE '%"+newkey+"%' OR `name` LIKE '%"+newkey+"%' OR `isbn` LIKE '%"+newkey+"%' OR `isbn13` LIKE '%"+newkey+"%' OR `author` LIKE '%"+newkey+"%' OR `description` LIKE '%"+newkey+"%') GROUP BY isbn13) latest_products ON p.id = latest_products.max_id ORDER BY p.id DESC LIMIT 1000";
		//         var query = db.query(sql2, function(error, searchresult) {
		// 		if(error){
		// 			res.redirect('/errorPage');
		// 		} else {
		// 			res.render('front/searchview', {searchresult:searchresult,'title':title});
		// 		}
	    // 	});
	    // });
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

exports.electronicIndex = function(req, res){
    let title = 'Electronic Page'
    let sql = "SELECT * FROM books_category where is_deleted=0";
    let query = db.query(sql, function(err, result){
        res.render('electronic/e_page',{'title':title,'categorylist': result});
    });
}
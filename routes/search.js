exports.searchResult = (req, res, next) => {
  const xss = require("xss");
  const title = "Search result page";
  // Get and sanitize search query
  let searchQuery = xss(req.query.q || "").trim();
  const sanitizedPhrase = searchQuery
    .normalize("NFKD") // Normalize special characters
    .replace(/[\u2013\u2014]/g, "-") // Replace long dashes
    .replace(/[|!']/g, ""); // Remove problematic characters // Replace dashes

  if (sanitizedPhrase && sanitizedPhrase.length > 0) {
    // Use the entire sanitized query for multi-word phrase search
    const phrase = `%${sanitizedPhrase}%`; // Use % for wildcard matching

    // Build SQL query to match the entire phrase across relevant fields
    const sqlQuery = `
      SELECT p.*
      FROM products p
      WHERE p.is_deleted = 0 
      AND (
        name LIKE ? OR 
        author LIKE ? OR 
        publisher LIKE ? OR 
        isbn LIKE ? OR 
        isbn13 LIKE ? OR 
        description LIKE ? OR
        id LIKE ? OR
        is_deleted LIKE ?
      )
      ORDER BY p.id DESC
      LIMIT 1000;
    `;

    // Create an array with the same phrase for each field
    const params = Array(8).fill(phrase);

    // Execute the query
    db.query(sqlQuery, params, function (error, searchresult) {
      if (error) {
        console.error("Database Error:", error);
        return res.redirect("/errorPage");
      }

      if (!searchresult || searchresult.length === 0) {
        // If no results are found, render the view with an empty result set
        console.log("No search results found.");
        return res.render("front/searchview", {
          searchresult: [],
          title: title,
        });
      }

      // Render the view with search results
      res.render("front/searchview", {
        searchresult: searchresult,
        title: title,
      });
    });
  } else {
    // If no valid search query is provided
    res.render("front/searchview", { searchresult: [], title: title });
  }
};

function convertDate(d) {
  var converted_date = dateFormat(d, "dd.mmm.yyyy");
  return converted_date;
}

exports.viewSearch = function (req, res, next) {
  let Ids = req.params.id;
  let getSQL = "SELECT * FROM `blogs` where id='" + Ids + "'";
  db.query(getSQL, function (error, results) {
    res.render("view_search_blog.ejs", { results: results });
  });
};

// exports.searchResult = (req, res, next) => {
//   const xss = require("xss");
//   const title = "Search result page";

//   // Get and sanitize the search query
//   let searchQuery = xss(req.query.q || "").trim();
//   const sanitizedPhrase = searchQuery
//     .normalize("NFKD") // Normalize special characters
//     .replace(/[\u2013\u2014]/g, "-") // Replace long dashes
//     .replace(/[|!']/g, ""); // Remove problematic characters

//   if (sanitizedPhrase && sanitizedPhrase.length > 0) {
//     // Split the sanitized search query into words
//     const words = sanitizedPhrase.split(" ");

//     // Build the dynamic WHERE clause
//     const conditions = words
//       .map(
//         () =>
//           `(
//             p.name LIKE ? OR
//             p.author LIKE ? OR
//             p.publisher LIKE ? OR
//             p.isbn LIKE ? OR
//             p.isbn13 LIKE ?
//           )`
//       )
//       .join(" AND ");

//     // Final SQL query
//     const sqlQuery = `
//       SELECT p.*
//       FROM products p
//       WHERE p.is_deleted = 0
//       AND (${conditions})
//       ORDER BY p.name ASC, p.id DESC
//       LIMIT 1000;
//     `;

//     // Create an array of parameters for the SQL query
//     const params = words.flatMap((word) => Array(5).fill(`%${word}%`));
//     console.log("Executing SQL Query:", sqlQuery);
//     console.log("With Parameters:", params);

//     // Execute the query
//     db.query(sqlQuery, params, (error, searchresult) => {
//       if (error) {
//         console.error("Database Error:", error);
//         return res.redirect("/errorPage");
//       }

//       if (!searchresult || searchresult.length === 0) {
//         console.log("No search results found.");
//         return res.render("front/searchview", {
//           searchresult: [],
//           title: title,
//         });
//       }

//       // Render the search results page
//       res.render("front/searchview", {
//         searchresult: searchresult,
//         title: title,
//       });
//     });
//   } else {
//     // If no valid search query is provided
//     res.render("front/searchview", { searchresult: [], title: title });
//   }
// };

exports.searchResult = (req, res, next) => {
  const xss = require("xss");
  const title = "Search result page";

  // Get and sanitize the search query
  let searchQuery = xss(req.query.q || "").trim();
  const sanitizedPhrase = searchQuery
    .normalize("NFKD")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[|!']/g, "");

  if (sanitizedPhrase && sanitizedPhrase.length > 0) {
    // Split the search query into individual words
    const words = sanitizedPhrase.split(" ");

    // Build the SQL query
    const sqlQuery = `
      SELECT p.*,
        CASE
          WHEN p.publisher LIKE ? THEN 1
          WHEN p.name LIKE ? THEN 2
          WHEN p.author LIKE ? THEN 3
          WHEN p.isbn LIKE ? THEN 4
          WHEN p.isbn13 LIKE ? THEN 5
          ELSE 6
        END AS relevance
      FROM products p
      WHERE p.is_deleted = 0
      AND (
        p.publisher LIKE ? OR
        p.name LIKE ? OR
        p.author LIKE ? OR
        p.isbn LIKE ? OR
        p.isbn13 LIKE ?
      )
      OR (
        ${words
          .map(
            () =>
              `(INSTR(p.publisher, ?) > 0 OR INSTR(p.name, ?) > 0 OR INSTR(p.author, ?) > 0 OR INSTR(p.isbn, ?) > 0 OR INSTR(p.isbn13, ?) > 0)`
          )
          .join(" AND ")}
      )
      ORDER BY relevance ASC, p.id DESC
      LIMIT 1000;
    `;

    // Create the parameters for the exact match first, followed by partial matches
    const params = [
      sanitizedPhrase,
      sanitizedPhrase,
      sanitizedPhrase,
      sanitizedPhrase,
      sanitizedPhrase,
      `%${sanitizedPhrase}%`,
      `%${sanitizedPhrase}%`,
      `%${sanitizedPhrase}%`,
      `%${sanitizedPhrase}%`,
      `%${sanitizedPhrase}%`,
      ...words.flatMap((word) => Array(5).fill(word)),
    ];

    console.log("Executing SQL Query:", sqlQuery);
    console.log("With Parameters:", params);

    // Execute the query
    db.query(sqlQuery, params, (error, searchresult) => {
      if (error) {
        console.error("Database Error:", error);
        return res.redirect("/errorPage");
      }

      if (!searchresult || searchresult.length === 0) {
        console.log("No search results found.");
        return res.render("front/searchview", {
          searchresult: [],
          title: title,
        });
      }

      res.render("front/searchview", {
        searchresult: searchresult,
        title: title,
      });
    });
  } else {
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

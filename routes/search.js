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

  // Define stop words (words that should be ignored)
  const stopWords = new Set([
    "books",
    "the",
    "a",
    "an",
    "of",
    "in",
    "on",
    "for",
    "and",
    "to",
    "by",
    "edition",
    "series",
    "vol",
    "volume",
    "chapter",
    "author",
    "publisher",
    "name",
    "isbn",
    "isbn13",
    "title",
    "price",
    "sale",
    "discount",
    "year",
    "new",
    "used",
    "from",
    "through",
    "with",
    "this",
    "that",
    "which",
    "as",
    "at",
    "about",
    "after",
    "before",
    "into",
    "during",
    "until",
    "when",
    "where",
    "how",
    "on sale",
    "best",
    "seller",
    "in stock",
    "out of stock",
    "store",
    "shop",
    "shopping",
    "order",
    "cart",
    "buy",
    "purchase",
    "search",
    "add",
    "remove",
    "cart",
    "bookstore",
    "library",
    "author",
    "book",
    "copy",
    "edition",
    "language",
    "publication",
    "format",
  ]);

  // Get and sanitize the search query
  let searchQuery = xss(req.query.q || "").trim();
  const sanitizedPhrase = searchQuery
    .normalize("NFKD")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[|!']/g, "");

  // Escape special regex characters for safer use in regex
  const escapeRegex = (text) =>
    text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

  // If no search query, return empty results
  if (!sanitizedPhrase || sanitizedPhrase.length === 0) {
    return res.render("front/searchview", {
      searchresult: [],
      categorylist: [],
      title: title,
    });
  }

  // Split the search query into individual words and remove stop words
  const words = sanitizedPhrase
    .split(" ")
    .filter((word) => word.length > 0 && !stopWords.has(word.toLowerCase()));

  if (words.length === 0) {
    // If all words are stop words, return no results
    return res.render("front/searchview", {
      searchresult: [],
      categorylist: [],
      title: title,
    });
  }

  const escapedWords = words.map(escapeRegex).join("|");

  // Query for category list (fetch this first)
  const sqlCategoryList = `
    SELECT books_category.id, books_category.name, books_category.meta_title,
      books_category.meta_description, books_category.meta_canonical_tag, 
      products.cat_id, COUNT(*) as pro_count 
    FROM products 
    LEFT JOIN books_category ON books_category.id = products.cat_id 
    WHERE products.cat_id != '0' AND books_category.id != '' 
    GROUP BY products.cat_id 
    HAVING pro_count > 10 
    ORDER BY name 
    LIMIT 10;
  `;

  db.query(sqlCategoryList, (error, categorylist) => {
    if (error) {
      console.error("Database Error (Category List):", error);
      return res.redirect("/errorPage");
    }

    // Build the SQL query for search, matching partial word matches
    let sqlQuery = `
      SELECT p.*, 
        (
          (p.publisher REGEXP ?) + 
          (p.name REGEXP ?) + 
          (p.author REGEXP ?) + 
          (p.isbn REGEXP ?) + 
          (p.isbn13 REGEXP ?)
        ) AS relevance
      FROM products p
      WHERE p.is_deleted = 0
        AND (
          p.publisher REGEXP ? OR
          p.name REGEXP ? OR
          p.author REGEXP ? OR
          p.isbn REGEXP ? OR
          p.isbn13 REGEXP ?
        )
      ORDER BY relevance DESC, p.id DESC
      LIMIT 1000;
    `;

    const params = [
      escapedWords,
      escapedWords,
      escapedWords,
      escapedWords,
      escapedWords,
      escapedWords,
      escapedWords,
      escapedWords,
      escapedWords,
      escapedWords,
    ];

    db.query(sqlQuery, params, (error, searchresult) => {
      if (error) {
        console.error("Database Error (Search Query):", error);
        return res.redirect("/errorPage");
      }

      // Calculate match percentage and apply a threshold for relevance
      const matchThreshold = 0.5; // 50% match threshold

      const filteredResults = searchresult.filter((result) => {
        let matchCount = 0;

        // Count how many words match for each product
        words.forEach((word) => {
          const regex = new RegExp(escapeRegex(word), "i");
          if (
            regex.test(result.publisher) ||
            regex.test(result.name) ||
            regex.test(result.author) ||
            regex.test(result.isbn) ||
            regex.test(result.isbn13)
          ) {
            matchCount++;
          }
        });

        // Attach a relevance score to each product based on matching words
        const matchPercentage = matchCount / words.length;

        // Only include results that meet the match threshold
        if (matchPercentage >= matchThreshold) {
          result.relevanceScore = matchPercentage;
          return true;
        }
        return false;
      });

      // Sort the results by relevance score (highest first)
      const sortedResults = filteredResults.sort(
        (a, b) => b.relevanceScore - a.relevanceScore
      );

      res.render("front/searchview", {
        searchresult: sortedResults || [],
        categorylist: categorylist,
        title: title,
      });
    });
  });
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

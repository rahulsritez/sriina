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

  // Define stop words
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
    "bookstore",
    "library",
    "book",
    "copy",
    "language",
    "publication",
    "format",
  ]);

  // Sanitize and prepare the search query
  let searchQuery = xss(req.query.q || "").trim();
  const sanitizedPhrase = searchQuery
    .normalize("NFKD")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[|!']/g, "");

  if (!sanitizedPhrase || sanitizedPhrase.length === 0) {
    return res.render("front/searchview", {
      searchresult: [],
      categorylist: [],
      title: title,
    });
  }

  // Remove stop words
  const words = sanitizedPhrase
    .split(" ")
    .filter((word) => word.length > 0 && !stopWords.has(word.toLowerCase()));

  if (words.length === 0) {
    return res.render("front/searchview", {
      searchresult: [],
      categorylist: [],
      title: title,
    });
  }

  // Log to ensure words are correctly parsed
  console.log("Search Words:", words);

  // Prepare the LIKE pattern for each word
  const wordPatterns = words.map((word) => `%${word}%`);

  // Query for category list
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

    // Dynamically build the WHERE clause for the SQL query
    const whereParts = [];
    const params = [];

    words.forEach((word) => {
      const likeWord = `%${word}%`;
      [
        "publisher",
        "name",
        "author",
        "isbn",
        "isbn13",
        "sub_category",
        "book_edition",
        "language",
        "description",
        "slug",
        "publishing_year",
        "final_subject",
        "book_language",
        "book_binding",
        "currency_code",
        "meta_description",
      ].forEach((field) => {
        whereParts.push(`p.${field} LIKE ?`);
        params.push(likeWord);
      });
    });

    const sqlQuery = `
      SELECT p.*
      FROM products p
      WHERE p.is_deleted = 0
        AND (${whereParts.join(" OR ")})
      ORDER BY p.id DESC
      LIMIT 1000;
    `;

    // Execute the search query
    db.query(sqlQuery, params, (error, searchresult) => {
      if (error) {
        console.error("Database Error (Search):", error);
        return res.redirect("/errorPage");
      }

      // Filter results based on word matching
      const matchThreshold = 0.5;
      const filteredResults = searchresult.filter((result) => {
        let matchCount = 0;
        words.forEach((word) => {
          const regex = new RegExp(
            word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
            "i"
          );
          if (
            regex.test(result.publisher) ||
            regex.test(result.name) ||
            regex.test(result.author) ||
            regex.test(result.isbn) ||
            regex.test(result.isbn13) ||
            regex.test(result.sub_category) ||
            regex.test(result.book_edition) ||
            regex.test(result.language) ||
            regex.test(result.description) ||
            regex.test(result.slug) ||
            regex.test(result.publishing_year) ||
            regex.test(result.final_subject) ||
            regex.test(result.book_language) ||
            regex.test(result.book_binding) ||
            regex.test(result.currency_code) ||
            regex.test(result.meta_description)
          ) {
            matchCount++;
          }
        });
        const matchPercentage = matchCount / words.length;
        if (matchPercentage >= matchThreshold) {
          result.relevanceScore = matchPercentage;
          return true;
        }
        return false;
      });

      // Sort by relevance
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

const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const { Readable } = require("stream");
const { create } = require("xmlbuilder2");
let sitemap;
var base64 = require("base-64");

exports.siteMapMethod = (req, res) => {
  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");
  // if (sitemap) {
  //     res.send(sitemap)
  //     return;
  //   }

  try {
    const str = req.url;
    const match = str.match(/(\d+)\.xml$/);

    if (!match) {
      throw new Error("Invalid URL format");
    }

    const pageNumber = parseInt(match[1], 10);
    const limit = 5000;
    const offset = (pageNumber - 1) * limit;

    const sql = `SELECT id, slug FROM products WHERE status='1' LIMIT ${limit} OFFSET ${offset}`;
    db.query(sql, (error, results) => {
      if (error) throw new Error("Products Table ERROR.");

      const xmlDoc = create({ version: "1.0", encoding: "UTF-8" }).ele(
        "urlset",
        { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" }
      );

      const resultArray = JSON.parse(JSON.stringify(results));

      if (resultArray.length === 0) {
        xmlDoc
          .ele("url")
          .ele("loc")
          .txt("https://sriina.com")
          .up()
          .ele("lastmod")
          .txt("2025-01-20")
          .up()
          .up();
      } else {
        resultArray.forEach(({ slug, id }) => {
          const slugUrl = `https://sriina.com/${slug}/${id}`;
          const lastModDate = new Date().toISOString().split("T")[0];
          xmlDoc
            .ele("url")
            .ele("loc")
            .txt(slugUrl)
            .up()
            .ele("lastmod")
            .txt(lastModDate)
            .up()
            .up();
        });
      }

      const xmlString = xmlDoc.end({ prettyPrint: true });

      const gzip = createGzip();
      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Content-Encoding", "gzip");
      res.status(200);
      gzip.pipe(res);
      gzip.end(xmlString);
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

function sanitize(text) {
  if (!text) return "";
  return text
    .replace(/&nbsp;/g, "&#160;")
    .replace(/&/g, "&amp;")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

exports.categoryXML = (req, res) => {
  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");
  try {
    const str = req.url;
    const match = str.match(/(\d+)\.xml$/);
    const pageNumber = parseInt(match[1], 10);
    const limit = 5000;

    const offset = (pageNumber - 1) * limit;

    var sql = `SELECT * FROM products LIMIT ${limit} OFFSET ${offset}`;
    var query = db.query(sql, function (error, results) {
      if (error) throw new Error("Products Table ERROR.");
      var resultArray = JSON.parse(JSON.stringify(results));
      const root = create({ version: "1.0", encoding: "UTF-8" })
        .ele("rss", {
          "xmlns:g": "http://base.google.com/ns/1.0",
          version: "2.0",
        })
        .ele("channel");
      root.ele("title").txt("Sriina");
      root.ele("link").txt("https://sriina.com/");

      resultArray.forEach(function (product, index) {
        const item = root.ele("item");

        const discountPercentage = product.discount;
        const discountAmount =
          (parseInt(product.price, 10).toFixed(2) * discountPercentage) / 100;
        const salePrice =
          parseInt(product.price, 10).toFixed(2) - discountAmount;

        item.ele("title").txt(sanitize(product.name));
        item
          .ele("link")
          .txt(`https://sriina.com/book/${product.slug}`);
        item.ele("description").txt(sanitize(product.description));
        item.ele("g:price").txt(`${salePrice} INR`);
        item
          .ele("g:availability")
          .txt(product.quantity > 0 ? "In Stock" : "Out of stock");
        item.ele("g:condition").txt("New");
        item.ele("g:id").txt(product.id);
        item
          .ele("g:image_link")
          .txt(`${process.env.IMAGE_URL}${product.image}`);
        item.ele("g:product_type").txt("Book");

        const shipping = item.ele("g:shipping");
        shipping.ele("g:country").txt("IN");
        shipping.ele("g:price").txt(product.delivery_charge);

        item.ele("g:brand").txt("Sriina");
        item.ele("g:identifier_exists").txt("No");
      });

      const xmlString = root.end({ prettyPrint: true });

      const gzip = createGzip();
      res.status(200);
      gzip.pipe(res);
      gzip.end(xmlString);
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

// exports.aboutPage = (req, res, next) => {
//     let title = 'About us';
//     var sql = "SELECT * FROM books_category where is_deleted=0";
//     var query = db.query(sql, function(error, result){
//         if(error) throw error;
//         var sql = "SELECT `title`, `description` FROM `pages` WHERE `id`='1' and `status` = '0'";
//         var query = db.query(sql, function(error, getpages){
//             if(error) throw error;
//             res.render('front/aboutus',{'title':title,'categorylist':result, getresult:getpages[0] });
//         });
//     });
// }

exports.returnPolicy = (req, res, next) => {
  let title = "Return Policy";
  var sql = "SELECT * FROM books_category where is_deleted=0";
  var query = db.query(sql, function (error, result) {
    if (error) throw error;
    var sql =
      "SELECT `title`, `description` FROM `pages` WHERE `id`='2' and `status` = '1'";
    var query = db.query(sql, function (error, getpages) {
      if (error) throw error;
      res.render("front/returnpolicy", {
        title: title,
        categorylist: result,
        getresult: getpages[0],
      });
    });
  });
};

exports.privacyPolicy = (req, res, next) => {
  let title = "Privacy Policy";
  var sql = "SELECT * FROM books_category where is_deleted=0";
  var query = db.query(sql, function (error, result) {
    if (error) throw error;
    var sql =
      "SELECT `title`, `description` FROM `pages` WHERE `id`='3' and `status` = '1'";
    var query = db.query(sql, function (error, getpages) {
      if (error) throw error;
      res.render("front/privacypolicy", {
        title: title,
        categorylist: result,
        getresult: getpages[0],
      });
    });
  });
};

exports.cancellationReturns = (req, res, next) => {
  let title = "Cancellation Returns";
  var sql = "SELECT * FROM books_category where is_deleted=0";
  var query = db.query(sql, function (error, result) {
    if (error) throw error;
    var sql =
      "SELECT `title`, `description` FROM `pages` WHERE `id`='4' and `status` = '1'";
    var query = db.query(sql, function (error, getpages) {
      if (error) throw error;
      res.render("front/cancellationreturns", {
        title: title,
        categorylist: result,
        getresult: getpages[0],
      });
    });
  });
};

exports.security = (req, res, next) => {
  let title = "Security";
  var sql = "SELECT * FROM books_category where is_deleted=0";
  var query = db.query(sql, function (error, result) {
    if (error) throw error;
    var sql =
      "SELECT `title`, `description` FROM `pages` WHERE `id`='5' and `status` = '1'";
    var query = db.query(sql, function (error, getpages) {
      if (error) throw error;
      res.render("front/security", {
        title: title,
        categorylist: result,
        getresult: getpages[0],
      });
    });
  });
};

exports.aboutPage = (req, res, next) => {
  let title = "About us";
  var sql = "SELECT * FROM books_category where is_deleted=0";
  var query = db.query(sql, function (error, result) {
    if (error) throw error;
    var sql =
      "SELECT `title`, `description` FROM `pages` WHERE `id`='1' and `status` = '1'";
    var query = db.query(sql, function (error, getpages) {
      if (error) throw error;
      res.render("front/aboutus", {
        title: title,
        categorylist: result,
        getresult: getpages[0],
      });
    });
  });
};

exports.termsPage = (req, res, next) => {
  let title = "Terms & Condition";
  var sql = "SELECT * FROM books_category where is_deleted=0";
  var query = db.query(sql, function (error, result) {
    if (error) throw error;
    var sql =
      "SELECT `title`, `description` FROM `pages` WHERE `id`='6' and `status` = '1'";
    var query = db.query(sql, function (error, getpages) {
      if (error) throw error;
      res.render("front/terms_conditions", {
        title: title,
        categorylist: result,
        getresult: getpages[0],
      });
    });
  });
};

exports.shippingDeliveryPage = (req, res, next) => {
  let title = "Shipping & Delivery";
  var sql = "SELECT * FROM books_category where is_deleted=0";
  var query = db.query(sql, function (error, result) {
    if (error) throw error;
    var sql =
      "SELECT `title`, `description` FROM `pages` WHERE `id`='7' and `status` = '1'";
    var query = db.query(sql, function (error, getpages) {
      if (error) throw error;
      res.render("front/shipping_delivery", {
        title: title,
        categorylist: result,
        getresult: getpages[0],
      });
    });
  });
};

exports.contactPage = (req, res) => {
  let title = "Contact";
  let sql = "SELECT * FROM books_category where is_deleted=0";
  let query = db.query(sql, function (err, result) {
    res.render("front/contact", { title: title, categorylist: result });
  });
};

/*exports.getCategories = function(req, res, next){
    try{
    var perPage = 5;
    var page = req.query.page;
    var offset = (page - 1) * perPage;
    var qs = req.query;

    var qs = req.query;
    let sql = "SELECT `cat_id`,`url_name` FROM category_url WHERE url_name = '"+req.params.id+"'";
    var query = db.query(sql, function(error,getCat_id){
        if(error) throw new Error('category url not found in categroy_url table');
        if(getCat_id.length>0){
            let catId = getCat_id[0].cat_id;
            let url_name = getCat_id[0].url_name;

            let sql = "SELECT * FROM products where is_deleted=0 and cat_id='"+catId+"'";
            let query = db.query(sql, function(error, result){
                if(error) throw new Error('products table Data Problem');

                var prodsQuery = '';
                if(typeof page == 'undefined'){
                    prodsQuery = "SELECT * FROM products where status='1' and cat_id='"+catId+"' order by id desc limit "+perPage+" ";
                } else {
                    var offset = parseInt((page - 1)) * parseInt(perPage);
                    prodsQuery = "SELECT * FROM products where status='1' and cat_id='"+catId+"' order by id desc limit "+perPage+" OFFSET "+offset;
                }

                    var query = db.query(prodsQuery, function(error, results, fields){
                    var qw = result.length;
                    var jsonResult = {
                        'current':page,
                        'products':results,
                        'pages' : Math.ceil(qw/perPage),
                    }
                    var myJsonString = JSON.parse(JSON.stringify(jsonResult));

                let sql2 = "SELECT * from books_category where id='"+catId+"' and is_deleted=0";
                let query = db.query(sql2, function(error, getmeta){
                    if(error) throw new Error('books_category Table Problem');
                    var sql_plan = "SELECT MAX(plan_price) as MaxPlanPrice FROM plans";
                    var query = db.query(sql_plan, function(error, maxplan){
                        if(error) throw new Error('plans Table Problem')
                        var allcat = "SELECT * from books_category where is_deleted=0 order by name;"
                        var query = db.query(allcat,function(error,getcategory){
                            if(error) throw new Error('books_category table problem');
                            res.render('front/productbycategory',{getmeta: getmeta[0],categorylist: getcategory, productlist: result, maxplan:maxplan,get_url_name:url_name,myJsonString:myJsonString});
                        });
                    });
                });
            });
        });
        } else {
            res.redirect("/");
        }
    });
    }catch(error){
        console.log(error);
    }
}*/

exports.getCategories = async function (req, res, next) {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * perPage;

    // Step 1: Get category info
    const [getCat_id] = await db.promise().query(
      `SELECT cu.cat_id, cu.url_name, cu.category_type_id, bc.parents_id
       FROM category_url AS cu
       INNER JOIN books_category AS bc ON bc.id = cu.cat_id
       WHERE cu.url_name = ?`,
      [req.params.id]
    );

    if (getCat_id.length === 0) {
      return res.redirect("/");
    }

    const { cat_id: catId, url_name, category_type_id, parents_id: parent_id } = getCat_id[0];

    // Step 2: Build products SQL (sql1)
    let sql1 = "";
    let sqlParams = [];

    let child_categories = [];
    if (parent_id === 0) {
      [child_categories] = await db.promise().query(
        "SELECT id FROM books_category WHERE parents_id = ? AND is_deleted = 0",
        [catId]
      );
    }

    if (parent_id === 0) {
      if (child_categories.length > 0) {
        const childIds = child_categories.map(c => c.id).join(",");
        sql1 = `SELECT * FROM products WHERE status=1 AND cat_id IN (${childIds}) AND product_type_id=?`;
        sqlParams = [category_type_id];
      } else {
        // fallback if no child categories exist
        sql1 = `SELECT * FROM products WHERE status=1 AND product_type_id=?`;
        sqlParams = [category_type_id];
      }
    } else {
      sql1 = `SELECT * FROM products WHERE status=1 AND cat_id=? AND product_type_id=?`;
      sqlParams = [catId, category_type_id];
    }

    const [products] = await db.promise().query(sql1, sqlParams);

    // Step 3: Handle pagination queries
    let prodsQuery = "";
    let prodsParams = [];

    if (category_type_id === 1) {
      if (child_categories.length > 0) {
        const childIds = child_categories.map(c => c.id).join(",");
        prodsQuery = `SELECT * FROM products WHERE status=1 AND cat_id IN (${childIds}) AND product_type_id=1 LIMIT ? OFFSET ?`;
        prodsParams = [perPage, offset];
      } else {
        // fallback if no child categories exist
        prodsQuery = `SELECT * FROM products WHERE status=1 AND cat_id = ? AND product_type_id=? LIMIT ? OFFSET ?`;
        prodsParams = [catId, category_type_id, perPage, offset];
      }
    } else if (category_type_id === 2) {
      prodsQuery = `
        SELECT p.id, p.cat_id, p.product_type_id, p.name, p.price, p.discount, p.delivery_charge, p.sku,
               p.description, p.image, p.slug, p.status, p.unit, p.grocery_category, p.grocery_sub_category,
               pi.grocery_image AS groceryImage,
               pv.unit_price AS groceryPrice, pv.unit_discount AS groceryDiscount,
               pv.inventory AS groceryQuantity, pv.unit_weight AS groceryWeight
        FROM products p
        INNER JOIN products_images pi ON pi.product_id = p.id
        INNER JOIN product_variables pv ON pv.product_id = p.id
        WHERE p.cat_id=?
        GROUP BY p.name
        LIMIT ? OFFSET ?`;
      prodsParams = [catId, perPage, offset];
    }

    console.log(prodsQuery);
    const [results] = prodsQuery ? await db.promise().query(prodsQuery, prodsParams) : [[]];

    // Step 4: Build JSON response
    const jsonResult = {
      products_page_count: results.length,
      current: page,
      products: results,
      pages: Math.ceil(products.length / perPage),
    };

    const myJsonString = JSON.parse(JSON.stringify(jsonResult));

    // Step 5: Get category meta + other info
    let tblCategory = "";
    if (category_type_id === 1) {
      tblCategory = "books_category";
    } else if (category_type_id === 2) {
      tblCategory = "grocery_category";
    }

    const [getmeta] = await db.promise().query(
      `SELECT * FROM ${tblCategory} WHERE id=? AND status=1`,
      [catId]
    );

    const [maxplan] = await db.promise().query(
      "SELECT MAX(plan_price) as MaxPlanPrice FROM plans"
    );

    const [getcategory] = await db.promise().query(
      `SELECT * FROM ${tblCategory} WHERE status=1 ANd parents_id = 0 AND is_deleted = 0 ORDER BY id ASC`
    );

    // Step 6: Render view
    if (category_type_id === 1) {
      res.render("front/productbycategory", {
        csrfToken: req.csrfToken(),
        getmeta: getmeta[0],
        categorylist: getcategory,
        productlist: products,
        maxplan,
        get_url_name: url_name,
        myJsonString,
      });
    } else {
      const [groceryCategory] = await db.promise().query(
        "SELECT * FROM grocery_category WHERE status=1"
      );

      res.render("grocery/g_page", {
        title: "Grocery Home Page",
        categorylist: groceryCategory,
        products: results,
        maxplan,
        myJsonString,
        get_url_name: "",
        base64,
        getmeta: getmeta[0],
      });
    }
  } catch (error) {
    console.error("getCategories error:", error);
    next(error);
  }
};


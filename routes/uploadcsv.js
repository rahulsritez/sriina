exports.findMissingImage = (req, res) => {
  const axios = require("axios");
  const { page, limit } = req.query;
  console.log(page,limit)
  const offset = (page-1)*limit;
  var sql_plan = `SELECT isbn13, image from products limit ${limit} offset ${offset} `;
  console.log(sql_plan)
  db.query(sql_plan, async function (error, result) {
    const missingImage = [];
    for (let product of result) {
      console.log(
        `https://sriina-images.s3.ap-south-1.amazonaws.com/${product.image}`
      );
      try {
        await axios.get(
          "https://sriina-images.s3.ap-south-1.amazonaws.com/" + product.image
        );
      } catch (e) {
        console.log("e.response", e.response);
        if (e.response.status == 403) {
          missingImage.push(product);
        }
      }
    }
    res.send(missingImage);
  });
};

exports.uploadExcel = (req, res) => {
  if (req.method == "GET") {
    userId = req.session.userId;
    var userType = req.session.type;
    if (userId == null && userType == null) {
      res.render("admin/admin", {
        message: "Please login as admin",
        message_success: "",
      });
    } else {
      res.render("admin/uploadexcel", {
        message: req.flash("message"),
        errors: req.flash("errors"),
        csrfToken: req.csrfToken(),
      });
    }
  }
};
exports.uploadExcelFile = (req, res, next) => {
  if (req.url == "/uploadexcelfile") {
    const path = require("path");
    const __basedir = path.resolve();
    const readXlsxFile = require("read-excel-file/node");
    const exFile = __basedir + "/exceldata/" + req.file.filename;
    console.log("req.file --->", exFile);
    readXlsxFile(exFile).then((rows) => {
      const headers = rows[0];
      rows.shift();
      const db_fields_books = [
        "isbn",
        "isbn13",
        "name",
        "author",
        "publisher",
        "book_edition",
        "book_language",
        "book_binding",
        "currency_code",
        "price",
        "weight",
        "delivery_charge",
        "quantity",
        "discount",
        "publishing_year",
        "description",
        "no_of_pages",
        "image",
        "cat_id",
        "cluster_subject",
        "author_details",
      ];
      res.send({
        status: true,
        headers,
        db_fields_books,
        file_name: req.file.filename,
        message: "xlsx file get successfully",
      });
      return;

      let sql1 =
        "INSERT INTO products(`user_id`,`product_type_id`,`name`,`author`,`publisher`,`book_edition`,`price`,`discount`,`delivery_charge`,`quantity`,`isbn`,`isbn13`,`language`,`book_binding`,`cat_id`,`status`,`no_of_pages`,`weight`,`image`,`description`,`slug`,`product_type`,`publishing_year`, `author_details`, `meta_title`, `meta_description`, `created_at`,`updated_at`) VALUES ('" +
        userId +
        "','" +
        product_type_id +
        "','" +
        product_name +
        "', '" +
        author +
        "','" +
        publisher +
        "','" +
        book_edition +
        "', '" +
        price +
        "', '" +
        discount +
        "','" +
        delivery_charge +
        "','" +
        quantity +
        "', '" +
        ISBN +
        "', '" +
        ISBN13 +
        "', '" +
        language +
        "', '" +
        book_binding +
        "', '" +
        category +
        "', '" +
        status +
        "', '" +
        no_of_pages +
        "', '" +
        weight +
        "', '" +
        productimage +
        "','" +
        descriptions +
        "', '" +
        slug_url +
        "', '" +
        product_type +
        "','" +
        publishing_year +
        "', '" +
        author_details +
        "', '" +
        meta_title +
        "','" +
        meta_description +
        "', '" +
        today +
        "','" +
        today +
        "')";

      var queryNew = db.query(sql1, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          req.flash("message", "Product has been successfully added.");
          res.redirect("/productlist");
        }
      });
      // let query = 'INSERT INTO products (isbn, name, author, publisher, book_edition, book_language, book_binding, currency_code, price, weight, delivery_charge, quantity, discount, publishing_year, description, no_of_pages, image, cat_id, product_type_id, created_at) VALUES ?';
      // let query = 'INSERT INTO products (isbn, author, name, final_subject, publishing_year, price, currency_code, book_binding, publisher, discount, delivery_charge, description, author_details, book_language, weight, image, no_of_pages, quantity, cat_id, product_type_id, created_at) VALUES ?';
      // let query = 'INSERT INTO products (isbn, name, currency_code, price, author, discount, delivery_charge, description, publisher, publishing_year, book_language, book_binding, weight, image, author_details, no_of_pages, quantity, cat_id, product_type_id, created_at) VALUES ?';
      let query =
        "INSERT INTO products (isbn13, name, author, publisher, book_edition, book_language, book_binding, currency_code, price, weight, delivery_charge, quantity, discount, publishing_year, description, no_of_pages, image, cat_id, product_type_id, created_at) VALUES ?";
      // console.log('xlsx upload query -->', query)
      db.query(query, [rows], (error, response) => {
        if (error) throw error;
        // console.log(error || response);
        req.flash("message", "Excel File has been successfully updated.");
        res.redirect("/uploadexcel");
      });
    });
    return true;
  } else {
    console.log("Please check http request");
  }
};

function capitalizeFirstLetter(string) {
  string = string.replaceAll(" ", "_").trim().toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.saveExcelFileData = (req, res, next) => {
  userId = req.session.userId;
  var userType = req.session.type;
  if (userId == null && userType == null) {
    res.render("admin/admin", {
      message: "Please login as admin",
      message_success: "",
    });
    return;
  }

  var formidable = require("formidable");
  var form = new formidable.IncomingForm();
  const path = require("path");
  const __basedir = path.resolve();
  const readXlsxFile = require("read-excel-file/node");
  const CC = require("currency-converter-lt");
  var slugify = require("slugify");

  form.parse(req, function (err, fields, files) {
    console.log("fields.mapped_fields -->", fields.mapped_fields);
    const xlsx_file_name = fields.xlsx_file_name;
    const mapped_fields = JSON.parse(fields.mapped_fields);
    const header = fields.header;

    const exFile = __basedir + "/exceldata/" + xlsx_file_name;
    console.log("req.file --->", exFile);

    readXlsxFile(exFile).then(async (rows) => {
      const headers = rows[0];
      rows.shift();

      const newBooksArr = [];
      rows.forEach((record) => {
        var newArr = {};
        headers.forEach((value, key) => {
          newArr[capitalizeFirstLetter(value)] = record[key];
        });
        newBooksArr.push(newArr);
      });

      var failed_by_name = 0;
      var failed_by_isbn = 0;
      var failed_by_isbn10 = 0;
      var failed_by_isbn13 = 0;
      // var failed_by_page = 0;
      // var failed_by_image = 0;
      var failed_by_price = 0;
      var failed_by_exist = 0;
      var errors = null;
      var total = 0;
      var uploaded = 0;

      const promises = newBooksArr.map(async (row, index, array) => {
        total += 1;
        var is_valid_record = true;
        const data = {};
        for (const [key, value] of Object.entries(mapped_fields)) {
          var valueData = row[value];
          if (key == "isbn13" || key == "isbn") {
            valueData = valueData.toString().replace(/\D/g, "");
            // valueData = valueData.replace(/\D/g,'');
          }
          data[key] = valueData;
        }
        var slug_url = slugify(data["name"], {
          replacement: "-",
          remove: /[,*+~.(){}'"\/\\#$%<>?!:@]/g,
          lower: true,
          strict: false,
        });
        data["slug"] = slug_url;
        data["user_id"] = userId;
        //data['cat_id'] = 0;
        data["product_type_id"] = 1;
        data["created_at"] = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        data["updated_at"] = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        const currCode = data["currency_code"];
        const price = data["price"];
        let currencyConverter = new CC();
        if (currCode && price) {
          const finalAmount = await currencyConverter
            .from(currCode)
            .to("INR")
            .amount(price)
            .convert()
            .then((response) => {
              return response;
            });
          if (finalAmount) {
            data["price"] = finalAmount;
          }
        } else if (!price) {
          is_valid_record = false;
          failed_by_price += 1;
        }
        data["currency_code"] = "INR";
        if (data["price"] <= 60) {
          data["delivery_charge"] = 60;
        }
        if (!data["quantity"]) {
          data["quantity"] = 50;
        }
        if (data["description"]) {
          data["description"] = data["description"].replaceAll('"', "'");
        }
        if (data["name"]) {
          data["name"] = data["name"].replaceAll('"', "'");
        }

        if (!data["name"] || data["name"].search(/\w/) < 0) {
          is_valid_record = false;
          failed_by_name += 1;
        }

        data.no_of_pages = data.no_of_pages ? data.no_of_pages : 0;
        // if(!data.no_of_pages){
        //     is_valid_record = false;
        //     failed_by_page += 1;
        // }

        // if(!data.image){
        //     is_valid_record = false;
        //     failed_by_image += 1;
        // }
        console.log("data", data, data["book_language"]);
        if (data["book_language"]) {
          const language = {
            english: 1,
            hindi: 2,
            bengali: 3,
            marathi: 4,
            kannada: 5,
            malayalam: 6,
            urdu: 7,
          };
          const bookLanguage = data["book_language"].toLowerCase();
          console.log("bookLanguage", bookLanguage);
          data["language"] = language[bookLanguage] || null;
        }

        if (data["image"]) {
          data["image"] = data["image"];
        }
        if (data["author"]) {
          data["author"] = data["author"];
        }

        if (data["publisher"]) {
          data["publisher"] = data["publisher"];
        }

        if (data["weight"]) {
          data["weight"] = data["weight"];
        }

        if (data["publishing_year"]) {
          data["publishing_year"] = data["publishing_year"];
        }

        if (data["cat_id"]) {
          data["cat_id"] = data["cat_id"];
        }

        if (data["discount"]) {
          data["discount"] = data["discount"];
        }

        if (data["book_edition"]) {
          data["book_edition"] = data["book_edition"];
        }
        if (data["author_details"]) {
          data["author_details"] = data["author_details"];
        }
        if (data["book_binding"]) {
          data["book_binding"] = data["book_binding"];
        }

        data["product_type"] = 1;

        // make it optional
        if (data.isbn && (data.isbn.length > 10 || data.isbn.length < 10)) {
          is_valid_record = false;
          failed_by_isbn10 += 1;
        }
        if (
          data["isbn13"] &&
          (data["isbn13"].length > 13 || data["isbn13"].length < 13)
        ) {
          is_valid_record = false;
          failed_by_isbn13 += 1;
        }
        if (!data["isbn"] && !data["isbn13"]) {
          is_valid_record = false;
          failed_by_isbn += 1;
        }

        if (is_valid_record) {
          var sql2 =
            "SELECT * FROM `products` WHERE  status=1 and (`isbn` ='" +
            data["isbn"] +
            "' or `isbn13` ='" +
            data["isbn13"] +
            "')";
          let results = await new Promise((resolveExist, reject) =>
            db.query(sql2, (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolveExist(results);
              }
            })
          );
          if (results.length) {
            is_valid_record = false;
            failed_by_exist += 1;
          }
        }

        if (is_valid_record) {
          const keys = Object.keys(data);
          const values = Object.values(data);
          const fields = keys.join();
          var fieldsValues = '"' + values.join('","') + '"';
          let sql1 =
            "INSERT INTO products(" +
            fields +
            ") VALUES (" +
            fieldsValues +
            ")";
          let results = await new Promise((resolveNew, reject) =>
            db.query(sql1, (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolveNew(results);
              }
            })
          );
          if (results && results.affectedRows && results.insertId) {
            uploaded += 1;
          }
        }
        return uploaded;
      });
      await Promise.all(promises)
        .then(() => {
          var failed = total - uploaded;
          if (failed == total) {
            req.flash(
              "message",
              `${uploaded} records uploaded out of ${total} records.`
            );
            failed_by_name
              ? req.flash(
                  "errors",
                  `${failed_by_name} failed due to name not valid`
                )
              : "";
            failed_by_isbn
              ? req.flash(
                  "errors",
                  `${failed_by_isbn} failed due to isbn not found`
                )
              : "";
            failed_by_isbn10
              ? req.flash(
                  "errors",
                  `${failed_by_isbn10} failed due to isbn only 10 digits`
                )
              : "";
            failed_by_isbn13
              ? req.flash(
                  "errors",
                  `${failed_by_isbn13} failed due to isbn13 only 13 digits`
                )
              : "";
            // failed_by_page ? req.flash('errors', `${failed_by_page} failed due to no of book page not found`) : '';
            // failed_by_image ? req.flash('errors', `${failed_by_image} failed due to image value not found`) : '';
            failed_by_price
              ? req.flash(
                  "errors",
                  `${failed_by_price} failed due to price value not found`
                )
              : "";
            failed_by_exist
              ? req.flash(
                  "errors",
                  `${failed_by_exist} failed due to record already exists`
                )
              : "";
            errors
              ? req.flash("error", `${errors} failed to getting error`)
              : "";
          } else {
            req.flash(
              "message",
              `Bulk contacts successfully added. Total ${uploaded} uploaded, ${failed} failed out of ${total} records.`
            );
            if (failed) {
              failed_by_name
                ? req.flash(
                    "errors",
                    `${failed_by_name} failed due to name not valid`
                  )
                : "";
              failed_by_isbn
                ? req.flash(
                    "errors",
                    `${failed_by_isbn} failed due to isbn not found`
                  )
                : "";
              failed_by_isbn10
                ? req.flash(
                    "errors",
                    `${failed_by_isbn10} failed due to isbn only 10 digits`
                  )
                : "";
              failed_by_isbn13
                ? req.flash(
                    "errors",
                    `${failed_by_isbn13} failed due to isbn13 only 13 digits`
                  )
                : "";
              // failed_by_page ? req.flash('errors', `${failed_by_page} failed due to no of book page not found`) : '';
              // failed_by_image ? req.flash('errors', `${failed_by_image} failed due to image value not found`) : '';
              failed_by_price
                ? req.flash(
                    "errors",
                    `${failed_by_price} failed due to price value not found`
                  )
                : "";
              failed_by_exist
                ? req.flash(
                    "errors",
                    `${failed_by_exist} failed due to record already exists`
                  )
                : "";
              errors
                ? req.flash("error", `${errors} failed to getting error`)
                : "";
            }
          }
          res.redirect("/productlist");
        })
        .catch((error) => {
          console.log("error -->", error);
          req.flash("errors", error);
          res.redirect("/uploadexcel");
        });
    });
  });
};

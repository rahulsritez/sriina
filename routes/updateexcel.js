exports.uploadExcel = (req, res) => {
  if (req.method == "GET") {
    userId = req.session.userId;

    var userType = req.session.type;
    if (userType !== 1) {
      res.redirect("/");
    }
    if (userId == null && userType == null) {
      res.render("admin/admin", {
        message: "Please login as admin",
        message_success: "",
      });
    } else {
      res.render("admin/updateexcel", {
        message: req.flash("message"),
        errors: req.flash("errors"),
        csrfToken: req.csrfToken(),
      });
    }
  }
};

exports.uploadExcelFile = async (req, res) => {
  if (req.url === "/updateexcelfile") {
    try {
      const path = require("path");
      const __basedir = path.resolve();
      const readXlsxFile = require("read-excel-file/node");
      const exFile = __basedir + "/exceldata/" + req.file.filename;
      console.log("req.file --->", exFile);
      const rows = await readXlsxFile(exFile);
      if (!rows || rows.length < 2) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid Excel file format." });
      }

      const headers = rows[0]; // Extract headers
      rows.shift(); // Remove header row

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

      // Database update logic
      let updatedCount = 0;
      let skippedCount = 0;

      for (const row of rows) {
        const [isbn, isbn13, name, , , , , , , price, , , quantity] = row; // Extract needed values

        if (!isbn13 || !price || !quantity || !name) continue; // Skip invalid rows

        // Check if ISBN exists in database
        const checkQuery = "SELECT * FROM products WHERE isbn13 = ?";
        const [existingProduct] = await db
          .promise()
          .query(checkQuery, [isbn13]);

        if (existingProduct.length > 0) {
          // Update product details if match found
          const updateQuery = `
              UPDATE products 
              SET price = ?, quantity = ?, name = ?, updated_at = NOW() 
              WHERE isbn13 = ?`;
          await db
            .promise()
            .query(updateQuery, [price, quantity, name, isbn13]);
          updatedCount++;
        } else {
          skippedCount++;
        }
      }

      res.json({
        status: true,
        message: "Excel file processed successfully",
        updatedRecords: updatedCount,
        skippedRecords: skippedCount,
      });
    } catch (error) {
      console.error("Error processing Excel file:", error);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ status: false, message: "Invalid request URL" });
  }
};

function capitalizeFirstLetter(string) {
  string = string.replaceAll(" ", "_").trim().toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}
exports.saveExcelFileData = async (req, res, next) => {
  const userId = req.session.userId;
  const userType = req.session.type;

  if (!userId || !userType) {
    req.flash("error", "Please login as admin");
    return res.redirect("/admin");
  }

  const formidable = require("formidable");
  const path = require("path");
  const readXlsxFile = require("read-excel-file/node");
  const slugify = require("slugify");

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      req.flash("error", "File upload failed.");
      return res.redirect("/updateexcel");
    }

    try {
      const xlsx_file_name = fields.xlsx_file_name;
      const mapped_fields = JSON.parse(fields.mapped_fields);
      const exFile = path.join(__dirname, "../exceldata", xlsx_file_name);

      const rows = await readXlsxFile(exFile);
      const headers = rows.shift();

      const newBooksArr = rows.map((record) => {
        return headers.reduce((obj, key, index) => {
          obj[capitalizeFirstLetter(key)] = record[index];
          return obj;
        }, {});
      });

      let failedRecords = 0,
        updatedRecords = 0,
        skippedRecords = 0;

      const promises = newBooksArr.map(async (row) => {
        let data = {};

        // Map fields dynamically
        for (const [key, value] of Object.entries(mapped_fields)) {
          let valueData = row[value];
          if (key === "ISBN" || key === "ISBN13") {
            valueData = valueData
              ? valueData.toString().replace(/\D/g, "")
              : null;
          }
          data[key] = valueData;
        }

        data.slug = slugify(data.name || "", {
          replacement: "-",
          lower: true,
          remove: /[,*+~.(){}'"\/\\#$%<>?!:@]/g,
        });

        data.user_id = userId;
        data.product_type_id = 1;
        data.created_at = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        data.updated_at = data.created_at;
        data.currency_code = "INR";

        if (!data.isbn13) {
          failedRecords++;
          return;
        }

        let sqlCheck = "SELECT id FROM products WHERE isbn13 = ?";
        let [existingProduct] = await db
          .promise()
          .query(sqlCheck, [data.isbn13]);

        if (existingProduct.length) {
          // console.log("Updating Product:", data.isbn13, "Quantity:", data.quantity, "Price:", data.price, "Name:", data.name);
          // If product exists, update its details
          let sqlUpdate =
            "UPDATE products SET quantity = ?, price = ?, name = ?, updated_at = NOW() WHERE isbn13 = ?";
          let [result] = await db
            .promise()
            .query(sqlUpdate, [
              data.quantity,
              data.price,
              data.name,
              data.isbn13,
            ]);

          if (result.affectedRows) {
            updatedRecords++;
          } else {
            failedRecords++;
          }
        } else {
          // If product does NOT exist, skip it (don't insert)
          skippedRecords++;
        }
      });

      await Promise.all(promises);

      req.flash(
        "message",
        `Upload completed. ${updatedRecords} updated, ${skippedRecords} skipped, ${failedRecords} failed.`
      );
      res.redirect("/productlist");
    } catch (error) {
      console.error("Error processing file:", error);
      req.flash("error", "An error occurred while processing the file.");
      res.redirect("/updateexcel");
    }
  });
};


  exports.uploadExcel = (req, res) => {
    if (req.method == "GET") {
      userId = req.session.userId;

      var userType = req.session.type;
      if (userType !== 1) {
        res.redirect("/error_page");
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
  exports.uploadExcelFile = async (req, res, next) => {
    if (req.url == "/updateexcelfile") {
    const path = require("path");
    const __basedir = path.resolve();
    const readXlsxFile = require("read-excel-file/node");

    if (!req.file) {
        req.flash("errors", "No file uploaded.");
        return res.redirect("/updateexcel");
    }

    const exFile = __basedir + "/exceldata/" + req.file.filename;
    console.log("Excel File Path:", exFile);

    try {
        const rows = await readXlsxFile(exFile);
        rows.shift(); // Remove header row

        console.log("Processing Rows:", rows.length);

        for (let row of rows) {
            let [ISBN,book_name,price,quantity] = row; // Extract required fields

            // Check if the book with this ISBN exists
            let checkQuery = "SELECT * FROM products WHERE isbn = ?";
            let [existingBooks] = await db.promise().query(checkQuery, [ISBN]);

            if (existingBooks.length > 0) {
                // If the book exists, update name, price, and quantity
                let updateQuery = `
                    UPDATE products 
                    SET name = ?, price = ?, quantity = ? 
                    WHERE isbn = ?`;
                await db.promise().query(updateQuery, [book_name, price, quantity, ISBN]);
                console.log(`✅ Updated: ${book_name} (ISBN: ${ISBN})`);
            } else {
                console.log(`⏭️ Skipped: ISBN ${ISBN} not found`);
            }
        }

        req.flash("message", "Excel File processed successfully.");
        res.redirect("/updateexcel");

    } catch (error) {
        console.error("❌ Error Processing Excel File:", error);
        req.flash("errors", "Error processing file. Please try again.");
        res.redirect("/updateexcel");
    }
} else {
    console.log("Please check http request");
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
    const CC = require("currency-converter-lt");

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

            let failedRecords = 0, updatedRecords = 0, insertedRecords = 0;

            const promises = newBooksArr.map(async (row) => {
                let isValid = true;
                let data = {};

                // Map fields dynamically
                for (const [key, value] of Object.entries(mapped_fields)) {
                    let valueData = row[value];
                    if (key === "isbn13" || key === "isbn") {
                        valueData = valueData ? valueData.toString().replace(/\D/g, "") : null;
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
                data.created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
                data.updated_at = data.created_at;
                data.currency_code = "INR";

                if (!data.IMPS) {
                    failedRecords++;
                    return;
                }

                // Check if IMPS exists in the database
                let sqlCheck = "SELECT id FROM products WHERE IMPS = ?";
                let existingProduct = await db.query(sqlCheck, [data.IMPS]);

                if (existingProduct.length) {
                    // IMPS exists, so update only qty, price, bookname
                    let sqlUpdate = "UPDATE products SET qty = ?, price = ?, name = ?, updated_at = NOW() WHERE IMPS = ?";
                    let result = await db.query(sqlUpdate, [data.qty, data.price, data.name, data.IMPS]);

                    if (result.affectedRows) {
                        updatedRecords++;
                    } else {
                        failedRecords++;
                    }
                } else {
                    // IMPS does not exist, insert a new record
                    // let sqlInsert = "INSERT INTO products SET ?";
                    // let result = await db.query(sqlInsert, data);

                console.log('Data is not Matched');

                    if (result.affectedRows) {
                        insertedRecords++;
                    } else {
                        failedRecords++;
                    }
                }
            });

            await Promise.all(promises);

            req.flash("message", `Upload completed. ${insertedRecords} new, ${updatedRecords} updated, ${failedRecords} failed.`);
            res.redirect("/productlist");

        } catch (error) {
            console.error("Error processing file:", error);
            req.flash("error", "An error occurred while processing the file.");
            res.redirect("/updateexcel");
        }
    });
};

  
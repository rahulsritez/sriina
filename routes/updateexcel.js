const NUMERIC_PRODUCT_FIELDS = new Set([
  "price",
  "discount",
  "delivery_charge",
  "quantity",
  "cat_id",
]);

const REQUIRED_EXCEL_HEADERS = ["ISBN13", "BookName", "MRP", "Stock"];

const REQUIRED_DB_FIELDS = ["isbn13", "name", "price", "quantity"];

// import jobs run in the background so the HTTP request returns instantly,
// no matter how large the file is (avoids proxy/CDN gateway timeouts like a 524)
const importJobs = new Map();
const IMPORT_BATCH_SIZE = 300;
const JOB_RETENTION_MS = 60 * 60 * 1000; // keep a finished job's status around for an hour

function makeJobId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function toBatches(list, size) {
  const batches = [];
  for (let i = 0; i < list.length; i += size) batches.push(list.slice(i, i + size));
  return batches;
}

const PRODUCT_EXCEL_FIELDS = [
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
      const rows = await readXlsxFile(exFile);
      if (!rows || rows.length < 2) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid Excel file format." });
      }

      const headers = rows[0]; // Extract headers
      rows.shift(); // Remove header row

      const normalize = (text) => String(text || "").replace(/[\s_]/g, "").toLowerCase();
      const missingHeaders = REQUIRED_EXCEL_HEADERS.filter(
        (required) => !headers.some((header) => normalize(header) === normalize(required))
      );
      if (missingHeaders.length) {
        return res.send({
          status: false,
          error: "Missing mandatory column(s): " + missingHeaders.join(", "),
        });
      }

      const db_fields_books = PRODUCT_EXCEL_FIELDS;
      res.send({
        status: true,
        headers,
        db_fields_books,
        file_name: req.file.filename,
        message: "xlsx file get successfully",
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
// Runs in the background, detached from the request that triggered it. This is what
// keeps the HTTP response fast no matter how many rows the sheet has: large sheets
// used to mean one SELECT + one INSERT/UPDATE per row, which on a production DB
// (real network latency, unlike localhost) could take minutes and trip a 524 at the
// CDN/proxy long before the import finished. Batching (300 rows per query) plus running
// it after the response is sent removes both the slowness and the timeout risk.
async function runImportJob(jobId, exFile, mapped_fields, userId) {
  const job = importJobs.get(jobId);
  const readXlsxFile = require("read-excel-file/node");
  const slugify = require("slugify");

  try {
    const rows = await readXlsxFile(exFile);
    const headers = rows.shift();

    const newBooksArr = rows.map((record) => {
      return headers.reduce((obj, key, index) => {
        obj[capitalizeFirstLetter(key)] = record[index];
        return obj;
      }, {});
    });

    // last occurrence of a book code in the sheet wins if it appears more than once
    const byIsbn13 = new Map();
    let skippedRecords = 0;

    for (const row of newBooksArr) {
      let data = {};

      for (const [key, value] of Object.entries(mapped_fields)) {
        let excelFields = value.split(",");
        data[key] = row[capitalizeFirstLetter(excelFields[0])];
      }

      // book code must be exactly 13 digits, every mandatory value must be filled
      data.isbn13 = String(data.isbn13 == null ? "" : data.isbn13).trim();
      let isMissing = REQUIRED_DB_FIELDS.some(
        (field) => data[field] == null || String(data[field]).trim() === ""
      );
      if (!/^\d{13}$/.test(data.isbn13) || isMissing) {
        skippedRecords++;
        continue;
      }

      for (const key of Object.keys(data)) {
        if (NUMERIC_PRODUCT_FIELDS.has(key)) {
          // pull the leading number out of values like "100+"
          let match = String(data[key]).match(/-?\d+(\.\d+)?/);
          data[key] = match ? Number(match[0]) : 0;
        }
      }

      data.slug = slugify(data.name, {
        replacement: "-",
        lower: true,
        remove: /[,*+~.(){}'"\/\\#$%<>?!:@]/g,
      });
      data.user_id = userId;
      data.product_type_id = 1;
      data.created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
      data.updated_at = data.created_at;
      data.currency_code = "INR";

      byIsbn13.set(data.isbn13, data);
    }

    const rowsToSave = [...byIsbn13.values()];
    job.total = newBooksArr.length;
    job.skipped = skippedRecords;

    // one query per batch to find which book codes already exist, instead of one per row
    const existingIsbn13s = new Set();
    for (const batch of toBatches(rowsToSave, IMPORT_BATCH_SIZE)) {
      const codes = batch.map((data) => data.isbn13);
      const [existing] = await db
        .promise()
        .query(`SELECT isbn13 FROM products WHERE isbn13 IN (${codes.map(() => "?").join(",")})`, codes);
      existing.forEach((row) => existingIsbn13s.add(row.isbn13));
    }

    const toInsert = rowsToSave.filter((data) => !existingIsbn13s.has(data.isbn13));
    const toUpdate = rowsToSave.filter((data) => existingIsbn13s.has(data.isbn13));

    const insertColumns = [
      "isbn", "isbn13", "name", "author", "publisher", "book_edition", "book_language",
      "book_binding", "currency_code", "price", "weight", "delivery_charge", "quantity",
      "discount", "publishing_year", "description", "no_of_pages", "image", "cat_id",
      "cluster_subject", "author_details", "slug", "user_id", "product_type_id",
      "created_at", "updated_at",
    ];

    // multi-row INSERT per batch instead of one INSERT per row
    for (const batch of toBatches(toInsert, IMPORT_BATCH_SIZE)) {
      try {
        const values = batch.map((data) => [
          data.isbn || null,
          data.isbn13,
          data.name,
          data.author || null,
          data.publisher || null,
          data.book_edition || null,
          data.book_language || null,
          data.book_binding || null,
          data.currency_code,
          data.price,
          data.weight || 0,
          data.delivery_charge || 0,
          data.quantity,
          data.discount || 0,
          data.publishing_year || null,
          data.description || null,
          data.no_of_pages || 0,
          data.image || null,
          data.cat_id || null,
          data.cluster_subject || null,
          data.author_details || null,
          data.slug,
          data.user_id,
          data.product_type_id,
          data.created_at,
          data.updated_at,
        ]);
        await db
          .promise()
          .query(`INSERT INTO products (${insertColumns.join(", ")}) VALUES ?`, [values]);
        job.added += batch.length;
      } catch (batchError) {
        console.error("Import job " + jobId + ": insert batch failed:", batchError.message);
        job.failed += batch.length;
      }
      job.processed = job.added + job.updated + job.failed;
    }

    // only touch the columns that were actually mapped for this upload
    const updatableFields = Object.keys(mapped_fields).filter(
      (field) => PRODUCT_EXCEL_FIELDS.includes(field) && field !== "isbn13"
    );

    // one CASE-based UPDATE per batch (each row can set different values) instead of one UPDATE per row
    for (const batch of toBatches(toUpdate, IMPORT_BATCH_SIZE)) {
      try {
        const params = [];
        const setClause = updatableFields
          .map((field) => {
            const cases = batch.map((data) => {
              params.push(data.isbn13, data[field] === undefined ? null : data[field]);
              return "WHEN ? THEN ?";
            });
            return `${field} = CASE isbn13 ${cases.join(" ")} ELSE ${field} END`;
          })
          .concat("updated_at = NOW()")
          .join(", ");
        const codes = batch.map((data) => data.isbn13);
        await db
          .promise()
          .query(
            `UPDATE products SET ${setClause} WHERE isbn13 IN (${codes.map(() => "?").join(",")})`,
            [...params, ...codes]
          );
        job.updated += batch.length;
      } catch (batchError) {
        console.error("Import job " + jobId + ": update batch failed:", batchError.message);
        job.failed += batch.length;
      }
      job.processed = job.added + job.updated + job.failed;
    }

    job.status = "done";
    job.finishedAt = Date.now();
    job.message = `Upload completed. ${job.added} added, ${job.updated} updated, ${job.skipped} skipped (invalid book code or missing data), ${job.failed} failed.`;
  } catch (error) {
    console.error("Import job " + jobId + " failed:", error);
    job.status = "error";
    job.finishedAt = Date.now();
    job.message = "An error occurred while processing the file: " + error.message;
  } finally {
    setTimeout(() => importJobs.delete(jobId), JOB_RETENTION_MS).unref();
  }
}

exports.saveExcelFileData = async (req, res, next) => {
  const userId = req.session.userId;
  const userType = req.session.type;

  if (!userId || !userType) {
    req.flash("errors", "Please login as admin");
    return res.redirect("/admin");
  }

  const formidable = require("formidable");
  const path = require("path");

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      req.flash("errors", "File upload failed.");
      return res.redirect("/updateexcel");
    }

    try {
      const xlsx_file_name = fields.xlsx_file_name;
      const mapped_fields = JSON.parse(fields.mapped_fields);

      const unmapped = REQUIRED_DB_FIELDS.filter((field) => !mapped_fields[field]);
      if (unmapped.length) {
        req.flash("errors", "Mandatory field(s) not mapped: " + unmapped.join(", "));
        return res.redirect("/updateexcel");
      }

      const exFile = path.join(__dirname, "../exceldata", xlsx_file_name);
      const jobId = makeJobId();

      importJobs.set(jobId, {
        status: "processing",
        startedAt: Date.now(),
        total: 0,
        processed: 0,
        added: 0,
        updated: 0,
        skipped: 0,
        failed: 0,
        message: "",
      });

      // fire and forget: the request below returns immediately, this keeps running after
      runImportJob(jobId, exFile, mapped_fields, userId).catch((error) => {
        console.error("Import job " + jobId + " crashed:", error);
      });

      req.flash("message", "Import started in the background. Progress is shown below.");
      res.redirect("/updateexcel?job=" + jobId);
    } catch (error) {
      console.error("Error processing file:", error);
      req.flash("errors", "An error occurred while processing the file.");
      res.redirect("/updateexcel");
    }
  });
};

exports.importStatus = (req, res) => {
  const job = importJobs.get(req.params.jobId);
  if (!job) {
    return res.status(404).json({ status: "not_found" });
  }
  res.json(job);
};

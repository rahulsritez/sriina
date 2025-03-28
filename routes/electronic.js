const fs = require("fs");
path = require("path");

exports.electronicIndex = function (req, res) {
  let title = "Electronic Page";
  let sql = "SELECT * FROM books_category where is_deleted=0";
  let query = db.query(sql, function (err, result) {
    res.render("electronic/e_page", { title: title, categorylist: result });
  });
};

exports.getProductionTSVfile = function (req, res) {
  const sql = `
      SELECT id, name, description, pre_order_status, quantity, slug, image, price, discount, 
             currency_code, isbn, isbn13, publisher, cluster_subject, author_details, media_file_link, 
             book_binding, age_books, no_of_volumes, cat_id, unit, measure_unit_code, created_at
      FROM products 
      WHERE status = 1 
      AND is_deleted = 0 
      AND created_at > '2025-01-01'
    `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (rows.length === 0) {
      return res.status(404).send("No products found for the given criteria.");
    }

    const seenIds = new Set();
    const validImageExtensions = ["jpg", "jpeg", "png", "gif"];

    const productFeed = rows
      .filter((product) => {
        const id = product.id;
        if (!id || seenIds.has(id)) return false;
        seenIds.add(id);
        return true;
      })
      .map((product) => {
        const currency = "INR"; // Ensure INR

        // Ensure valid image format
        const imageUrl =
          product.image && process.env.IMAGE_URL
            ? `${process.env.IMAGE_URL.replace(/\/$/, "")}/${product.image}`
            : "";

        const imageExtension = imageUrl.split(".").pop().toLowerCase();
        const finalImageUrl = validImageExtensions.includes(imageExtension)
          ? imageUrl
          : process.env.DEFAULT_IMAGE_URL || "";

        // Ensure valid price calculation
        const price = parseFloat(product.price) || 0;
        const discount = parseFloat(product.discount) || 0;
        const finalSalePrice = (price - (price * discount) / 100).toFixed(2);
        const youSaveMoney = (price - finalSalePrice).toFixed(2);

        // Clean description (remove HTML tags & extra spaces)
        const cleanDescription = product.description
          ? product.description
              .replace(/<[^>]*>/g, "")
              .replace(/\s+/g, " ")
              .trim()
          : "Description not available";

        return {
          id: product.id || "",
          title: (product.name || "").substring(0, 150),
          description: cleanDescription.substring(0, 5000),
          availability:
            product.pre_order_status === 1
              ? "preorder"
              : product.quantity > 0
              ? "in_stock"
              : "out_of_stock",
          link: product.slug
            ? `${process.env.URL.replace(/\/$/, "")}/${product.slug}/${
                product.id
              }`
            : "",
          image_link: finalImageUrl,
          price: `${finalSalePrice} INR`,
          sale_price: `${finalSalePrice} INR`,
          you_save: `${youSaveMoney} INR`,
          brand: product.publisher || "Unknown",
          isbn: product.isbn13 || product.isbn || "",
          author: product.author_details || "",
          material: product.book_binding || "",
          age_group: product.age_books || "",
          multipack: product.no_of_volumes
            ? product.no_of_volumes.toString()
            : "",
          category: product.cat_id ? product.cat_id.toString() : "",
          quantity: product.quantity ? product.quantity.toString() : "",
          identifier_exists: product.isbn || product.isbn13 ? "TRUE" : "FALSE",
        };
      });

    const tsvHeaders = [
      "id",
      "title",
      "description",
      "availability",
      "link",
      "image_link",
      "price",
      "sale_price",
      "you_save",
      "brand",
      "isbn",
      "author",
      "material",
      "age_group",
      "multipack",
      "category",
      "quantity",
      "identifier_exists",
    ].join("\t");

    const tsvRows = productFeed.map((product) =>
      Object.values(product)
        .map((value) =>
          value !== null && value !== undefined ? `"${value}"` : '""'
        )
        .join("\t")
    );

    const validRows = tsvRows.filter(
      (row) => row.split("\t").length === tsvHeaders.split("\t").length
    );

    const tsvContent = [tsvHeaders, ...validRows].join("\n");

    const filePath = path.join(__dirname, "getMarketingUploadableProducts.tsv");
    fs.writeFileSync(filePath, tsvContent);

    res.download(filePath, "getMarketingUploadableProducts.tsv", (err) => {
      if (err) {
        console.error("Error sending TSV file:", err);
        res.status(500).send("Error sending file");
      }
    });
  });
};

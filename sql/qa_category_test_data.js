// QA test data for "Category & Product Verification" (LOCAL DB ONLY).
//   node sql/qa_category_test_data.js seed     -> adds the test categories + books
//   node sql/qa_category_test_data.js cleanup  -> removes everything it added
// Every row it creates is named "QA Test ..." / slug "qa-test-...", nothing else is touched.
require("dotenv").config();
const mysql = require("mysql2/promise");

const PREFIX = "QA Test";
const SLUG = "qa-test";

// category tree used for the test
//   QA Test Parent
//     ├─ QA Test Child 1
//     │    └─ QA Test Grandchild
//     └─ QA Test Child 2
//   QA Test Lonely Root      (top category without sub categories)
//   QA Test Deleted          (is_deleted = 1)
const CATEGORIES = [
  { key: "parent", name: "Parent", parent: null },
  { key: "child1", name: "Child 1", parent: "parent" },
  { key: "child2", name: "Child 2", parent: "parent" },
  { key: "grand", name: "Grandchild", parent: "child1" },
  { key: "lonely", name: "Lonely Root", parent: null },
  { key: "deleted", name: "Deleted", parent: null, is_deleted: 1 },
];

// books: 2 active books in every category + edge cases that must NOT show anywhere
const BOOKS = [
  ...["parent", "child1", "child2", "grand", "lonely"].flatMap((cat) => [
    { cat, n: 1 },
    { cat, n: 2 },
  ]),
  { cat: "child1", n: "inactive", status: 0 }, // inactive book
  { cat: "child1", n: "grocery", product_type_id: 2 }, // not a book
  { cat: "deleted", n: 1 }, // book in a deleted category
  { cat: null, n: "nocategory" }, // book without category
];

async function connect() {
  if (!["127.0.0.1", "localhost"].includes(process.env.DB_HOST)) {
    throw new Error("Refusing to run: DB_HOST is not local (" + process.env.DB_HOST + ")");
  }
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

async function cleanup(db) {
  const [cats] = await db.query("SELECT id FROM books_category WHERE name LIKE ?", [PREFIX + " %"]);
  const catIds = cats.map((c) => c.id);
  const [p] = await db.query("DELETE FROM products WHERE slug LIKE ?", [SLUG + "-%"]);
  let u = { affectedRows: 0 };
  let c = { affectedRows: 0 };
  if (catIds.length) {
    [u] = await db.query("DELETE FROM category_url WHERE cat_id IN (?) AND url_name LIKE ?", [catIds, SLUG + "-%"]);
    [c] = await db.query("DELETE FROM books_category WHERE id IN (?)", [catIds]);
  }
  console.log(`removed: ${p.affectedRows} books, ${u.affectedRows} category urls, ${c.affectedRows} categories`);
}

async function seed(db) {
  await cleanup(db); // start clean, so seed can be run again
  const ids = {};
  for (const cat of CATEGORIES) {
    const [r] = await db.query(
      "INSERT INTO books_category (parents_id, name, status, cat_type, is_deleted, created_at, updated_at) VALUES (?, ?, 1, 0, ?, NOW(), NOW())",
      [cat.parent ? ids[cat.parent] : 0, `${PREFIX} ${cat.name}`, cat.is_deleted || 0]
    );
    ids[cat.key] = r.insertId;
    const [[{ nextId }]] = await db.query("SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM category_url");
    await db.query(
      "INSERT INTO category_url (id, url_name, cat_id, status, category_type_id, created_at, updated_at) VALUES (?, ?, ?, 1, 1, NOW(), NOW())",
      [nextId, `${SLUG}-${cat.key}`, r.insertId]
    );
  }
  for (const b of BOOKS) {
    const label = `${b.cat || "none"}-${b.n}`;
    await db.query(
      "INSERT INTO products (user_id, product_type_id, product_type, name, author, price, discount, quantity, status, cat_id, slug, image, created_at, updated_at) VALUES (?, ?, 1, ?, 'QA', 100, 0, 5, ?, ?, ?, '', NOW(), NOW())",
      [2004, b.product_type_id || 1, `${PREFIX} Book ${label}`, b.status === 0 ? 0 : 1, b.cat ? ids[b.cat] : null, `${SLUG}-${label}`]
    );
  }
  console.log("category ids:", ids);
  console.log(`added ${CATEGORIES.length} categories and ${BOOKS.length} books`);
}

(async () => {
  const action = process.argv[2];
  if (!["seed", "cleanup"].includes(action)) {
    console.log("usage: node sql/qa_category_test_data.js seed|cleanup");
    process.exit(1);
  }
  const db = await connect();
  try {
    await (action === "seed" ? seed(db) : cleanup(db));
  } finally {
    await db.end();
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

// Verifies the QA test data from sql/qa_category_test_data.js (LOCAL ONLY).
//   node sql/qa_category_verify.js [http://localhost:3000]
// Checks that every book is shown with / under its own category in:
//   1. dashboard product list (category name of each book)
//   2. dashboard add/edit product dropdown (every category can be picked)
//   3. category pages on the site (book in its category + parent categories, nowhere else)
//   4. category sitemap
//   5. sql/verify_categories.sql book counts vs category page counts
require("dotenv").config();
const mysql = require("mysql2");
const ejs = require("ejs");
const path = require("path");

const SITE = process.argv[2] || "http://localhost:3000";
let failures = 0;
const ok = (msg) => console.log("  PASS  " + msg);
const fail = (msg) => {
  failures++;
  console.log("  FAIL  " + msg);
};
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  const q = async (sql, p) => (await pool.promise().query(sql, p))[0];

  const cats = await q("SELECT id, parents_id, name, is_deleted FROM books_category WHERE name LIKE 'QA Test %'");
  const urls = await q("SELECT cat_id, url_name FROM category_url WHERE url_name LIKE 'qa-test-%'");
  const books = await q("SELECT id, name, slug, cat_id, status, product_type_id FROM products WHERE slug LIKE 'qa-test-%'");
  if (!cats.length) throw new Error("No QA data, run: node sql/qa_category_test_data.js seed");

  const catById = Object.fromEntries(cats.map((c) => [c.id, c]));
  const urlByCat = Object.fromEntries(urls.map((u) => [u.cat_id, u.url_name]));
  const visibleBook = (b) => b.status == 1 && b.product_type_id == 1;
  // a category page shows books of the category and of all its (non deleted) sub categories
  const subtree = (id) => {
    const ids = [id];
    for (let i = 0; i < ids.length; i++)
      cats.filter((c) => c.parents_id == ids[i] && !c.is_deleted).forEach((c) => ids.push(c.id));
    return ids;
  };
  const expectedOnPage = (cat) =>
    cat.is_deleted ? [] : books.filter((b) => visibleBook(b) && subtree(cat.id).includes(b.cat_id)).map((b) => b.slug);

  // ---------- 1. dashboard product list ----------
  console.log("\n1. Dashboard product list (/productlist) shows each book with its own category");
  global.db = pool;
  global.baseURL = "https://sriina.com/";
  const user = require(path.resolve("routes/user.js"));
  const listData = await new Promise((resolve) =>
    user.productpage(
      { session: { userId: 2004, type: 1 }, query: { search: "QA Test", count: 100 }, flash: () => [] },
      { render: (view, data) => resolve(data), redirect: () => resolve(null) }
    )
  );
  const listed = listData.productlist;
  books.filter(visibleBook).forEach((b) => {
    const row = listed.find((r) => r.id === b.id);
    const expected = b.cat_id && catById[b.cat_id] ? catById[b.cat_id].name : null;
    if (!row) return fail(`${b.name} missing from dashboard list`);
    if ((row.categoryname || null) !== expected)
      fail(`${b.name}: dashboard says "${row.categoryname}", expected "${expected}"`);
    else ok(`${b.name} -> ${expected || "(no category)"}`);
  });
  books.filter((b) => !visibleBook(b)).forEach((b) => {
    listed.some((r) => r.id === b.id) ? fail(`${b.name} (hidden book) is listed`) : ok(`${b.name} not listed`);
  });

  // does the dashboard show the category at all?
  const html = await ejs.renderFile(path.resolve("views/admin/product.ejs"), {
    ...listData,
    ...require(path.resolve("helpers/image.js")),
    user: { type: 1 },
    csrfToken: "",
    baseURL: global.baseURL,
    process,
  }, { views: [path.resolve("views")] }).catch((e) => (fail("admin/product.ejs render error: " + e.message), ""));
  // the table row of a book that has a category must show that category (not inside an html comment)
  const visibleHtml = html.replace(/<!--[\s\S]*?-->/g, "");
  const tableRows = visibleHtml.match(/<tr>[\s\S]*?<\/tr>/g) || [];
  const withCat = listed.filter((r) => r.categoryname && !r.category_deleted);
  const shownOk = withCat.filter((b) => tableRows.some((tr) => tr.includes(b.name) && tr.includes(b.categoryname)));
  if (html && withCat.length) {
    shownOk.length === withCat.length
      ? ok(`category column is visible in the dashboard table (${shownOk.length}/${withCat.length} rows)`)
      : fail(`dashboard table shows the category for ${shownOk.length}/${withCat.length} books`);
  }
  const delBook = listed.find((r) => r.category_deleted);
  if (delBook)
    tableRows.some((tr) => tr.includes(delBook.name) && tr.includes("(deleted)"))
      ? ok(`${delBook.name} is marked "(deleted)" in the dashboard`)
      : fail(`${delBook.name} is in a deleted category but not marked in the dashboard`);

  // ---------- 2. dropdown ----------
  console.log("\n2. Add / edit product dropdown: every category can be picked");
  const options = [...html.matchAll(/<select[^>]*id="category"[\s\S]*?<\/select>/g)][0]?.[0] || "";
  const pickable = [...options.matchAll(/<option value="(\d+)"/g)].map((m) => Number(m[1]));
  cats.filter((c) => !c.is_deleted).forEach((c) => {
    pickable.includes(c.id) ? ok(`"${c.name}" can be picked`) : fail(`"${c.name}" cannot be picked in the dropdown`);
  });
  const deleted = cats.find((c) => c.is_deleted);
  if (deleted) pickable.includes(deleted.id) ? fail(`deleted "${deleted.name}" can be picked`) : ok(`deleted "${deleted.name}" not offered`);

  // ---------- 2b. dashboard category filter ----------
  console.log("\n2b. Dashboard category filter (/productlist?cat_id=) returns the same books as the category page");
  const listFor = (cat_id) =>
    new Promise((resolve) =>
      user.productpage(
        { session: { userId: 2004, type: 1 }, query: { search: "QA Test", count: 100, cat_id }, flash: () => [] },
        { render: (view, data) => resolve(data.productlist.map((p) => p.slug)), redirect: () => resolve([]) }
      )
    );
  for (const cat of cats) {
    const got = await listFor(String(cat.id));
    const expected = expectedOnPage(cat);
    same(got, expected)
      ? ok(`${cat.name}: ${got.length} books`)
      : fail(`${cat.name}: filter gives ${got.length} [${got.join(", ")}], expected ${expected.length}`);
  }
  const noCat = await listFor("none");
  const expectedNoCat = books
    .filter((b) => visibleBook(b) && (!b.cat_id || !catById[b.cat_id] || catById[b.cat_id].is_deleted))
    .map((b) => b.slug);
  same(noCat, expectedNoCat)
    ? ok(`"No / deleted category": ${noCat.length} books [${noCat.join(", ")}]`)
    : fail(`"No / deleted category": got [${noCat.join(", ")}], expected [${expectedNoCat.join(", ")}]`);

  // ---------- 3. category pages ----------
  console.log("\n3. Category pages on the site show the right books");
  for (const cat of cats) {
    const url = `${SITE}/${urlByCat[cat.id]}`;
    const res = await fetch(url, { redirect: "manual" }).catch((e) => ({ status: "ERR " + e.message }));
    const page = res.status === 200 ? await res.text() : "";
    const shown = [...new Set([...page.matchAll(/\/book\/(qa-test-[\w-]+)/g)].map((m) => m[1]))];
    const expected = expectedOnPage(cat);
    if (cat.is_deleted) {
      res.status === 200 && shown.length
        ? fail(`${cat.name} (deleted) page still opens and shows ${shown.length} book(s)`)
        : ok(`${cat.name} (deleted) page shows no books (status ${res.status})`);
      continue;
    }
    if (res.status !== 200) {
      fail(`${cat.name}: page ${url} returned ${res.status}`);
      continue;
    }
    if (same(shown, expected)) ok(`${cat.name}: ${shown.length} books, as expected`);
    else {
      fail(`${cat.name}: shows ${shown.length}, expected ${expected.length}`);
      expected.filter((s) => !shown.includes(s)).forEach((s) => console.log("          missing: " + s));
      shown.filter((s) => !expected.includes(s)).forEach((s) => console.log("          wrong:   " + s));
    }
  }

  // ---------- 4. sitemap ----------
  console.log("\n4. Category sitemap lists the same books as the category page");
  for (const cat of cats.filter((c) => !c.is_deleted)) {
    const res = await fetch(`${SITE}/sitemap/${urlByCat[cat.id]}.xml`).catch(() => ({ status: "ERR", text: async () => "" }));
    const xml = await res.text();
    const inMap = [...new Set([...xml.matchAll(/\/book\/(qa-test-[\w-]+)/g)].map((m) => m[1]))];
    const expected = expectedOnPage(cat);
    same(inMap, expected)
      ? ok(`${cat.name}: ${inMap.length} books`)
      : fail(`${cat.name}: sitemap has ${inMap.length} books [${inMap.join(", ")}], page has ${expected.length}`);
  }

  // ---------- 5. report sql ----------
  console.log("\n5. sql/verify_categories.sql (query 1) count matches the category page");
  const fs = require("fs");
  const report = fs.readFileSync(path.resolve("sql/verify_categories.sql"), "utf8").split(/;\s*\n/)[0].replace(/^--.*$/gm, "");
  const rows = await q(report);
  for (const cat of cats.filter((c) => !c.is_deleted)) {
    const row = rows.find((r) => r.id === cat.id);
    const expected = expectedOnPage(cat).length;
    row && Number(row.books) === expected
      ? ok(`${cat.name}: ${row.books}`)
      : fail(`${cat.name}: report says ${row ? row.books : "missing"}, category page shows ${expected}`);
  }

  console.log(`\n${failures ? failures + " check(s) FAILED" : "ALL CHECKS PASSED"}`);
  pool.end();
  process.exit(failures ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

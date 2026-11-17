// Shared helpers for book categories (books_category).
// One place decides "which books belong to a category", so the dashboard, the category page
// and the sitemap always return the same books.

// active books only (not grocery / electronics, not inactive)
const ACTIVE_BOOK_SQL = "status = 1 AND product_type_id = 1";

/**
 * The category id + the ids of all its sub categories (any level), deleted ones left out.
 * Returns [] when the category itself is deleted or does not exist.
 */
async function getCategoryIds(catId) {
  catId = Number(catId);
  if (!catId) return [];
  const [self] = await db.promise().query("SELECT id FROM books_category WHERE id = ? AND is_deleted = 0", [catId]);
  if (self.length === 0) return [];

  const ids = [catId];
  let parentIds = [catId];
  while (parentIds.length > 0) {
    const [children] = await db
      .promise()
      .query("SELECT id FROM books_category WHERE parents_id IN (?) AND is_deleted = 0", [parentIds]);
    parentIds = children.map((c) => c.id).filter((id) => !ids.includes(id)); // also stops on a parent loop
    ids.push(...parentIds);
  }
  return ids;
}

/**
 * Flat list of categories in tree order for a <select>, every level can be picked:
 *   [{ id, name, level }]  level 0 = top category, 1 = sub category, ...
 * `categories` = rows of books_category (already without deleted ones).
 */
function categoryOptions(categories) {
  const byParent = {};
  const ids = new Set(categories.map((c) => c.id));
  categories.forEach((c) => {
    // parent missing/deleted -> show it as a top category, so it can still be picked
    const parent = c.parents_id && ids.has(c.parents_id) ? c.parents_id : 0;
    (byParent[parent] = byParent[parent] || []).push(c);
  });

  const list = [];
  const seen = new Set();
  (function add(parentId, level) {
    (byParent[parentId] || [])
      .sort((a, b) => String(a.name).localeCompare(String(b.name)))
      .forEach((c) => {
        if (seen.has(c.id)) return;
        seen.add(c.id);
        list.push({ id: c.id, name: c.name, level });
        add(c.id, level + 1);
      });
  })(0, 0);
  return list;
}

module.exports = { ACTIVE_BOOK_SQL, getCategoryIds, categoryOptions };

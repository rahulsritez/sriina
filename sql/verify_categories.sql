-- Category & product checks (read only, safe to run)

-- 1. Number of active books in each category, with its parent and page url
--    books_direct = books saved in this category
--    books        = books shown on the category page (this category + all its sub categories)
WITH RECURSIVE tree AS (
  SELECT id AS root_id, id AS cat_id FROM books_category WHERE is_deleted = 0
  UNION ALL
  SELECT t.root_id, c.id FROM tree t
  JOIN books_category c ON c.parents_id = t.cat_id AND c.is_deleted = 0
)
SELECT bc.id, bc.name, parent.name AS parent_category,
       (SELECT cu.url_name FROM category_url cu
         WHERE cu.cat_id = bc.id AND cu.category_type_id = 1 LIMIT 1) AS url_name,
       (SELECT COUNT(*) FROM products p
         WHERE p.cat_id = bc.id AND p.status = 1 AND p.product_type_id = 1) AS books_direct,
       (SELECT COUNT(*) FROM products p JOIN tree t ON t.cat_id = p.cat_id
         WHERE t.root_id = bc.id AND p.status = 1 AND p.product_type_id = 1) AS books
FROM books_category bc
LEFT JOIN books_category parent ON parent.id = bc.parents_id
WHERE bc.is_deleted = 0
ORDER BY parent_category, bc.name;

-- 2. Categories that have no page url (their page cannot be opened)
SELECT bc.id, bc.name
FROM books_category bc
LEFT JOIN category_url cu ON cu.cat_id = bc.id
WHERE bc.is_deleted = 0 AND cu.cat_id IS NULL;

-- 3. Page urls pointing to a deleted or missing category
SELECT cu.url_name, cu.cat_id
FROM category_url cu
LEFT JOIN books_category bc ON bc.id = cu.cat_id AND bc.is_deleted = 0
WHERE cu.category_type_id = 1 AND bc.id IS NULL;

-- 4. Active books that do not belong to any valid category (they show in no category page)
SELECT COUNT(*) AS books_without_category
FROM products p
LEFT JOIN books_category bc ON bc.id = p.cat_id AND bc.is_deleted = 0
WHERE p.status = 1 AND p.product_type_id = 1 AND bc.id IS NULL;

-- 5. Same list of books (first 100) to fix in the dashboard
SELECT p.id, p.name, p.isbn13, p.cat_id
FROM products p
LEFT JOIN books_category bc ON bc.id = p.cat_id AND bc.is_deleted = 0
WHERE p.status = 1 AND p.product_type_id = 1 AND bc.id IS NULL
LIMIT 100;

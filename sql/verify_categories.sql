-- Category & product checks (read only, safe to run)

-- 1. Number of active books in each category, with its parent and page url
SELECT bc.id, bc.name, parent.name AS parent_category, cu.url_name,
       COUNT(p.id) AS books
FROM books_category bc
LEFT JOIN books_category parent ON parent.id = bc.parents_id
LEFT JOIN category_url cu ON cu.cat_id = bc.id AND cu.category_type_id = 1
LEFT JOIN products p ON p.cat_id = bc.id AND p.status = 1 AND p.product_type_id = 1
WHERE bc.is_deleted = 0
GROUP BY bc.id
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

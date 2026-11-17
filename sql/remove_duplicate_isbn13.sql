-- Remove duplicate products with same ISBN13.
-- Keeps the oldest product (lowest id) and deletes the others.
-- Take a backup of the products table before running this.

-- 1. See the duplicates first
SELECT isbn13, COUNT(*) AS total, GROUP_CONCAT(id ORDER BY id) AS product_ids
FROM products
WHERE isbn13 IS NOT NULL AND isbn13 != ''
GROUP BY isbn13
HAVING COUNT(*) > 1;

-- 2. Delete the duplicates
DELETE p1 FROM products p1
JOIN products p2
  ON p1.isbn13 = p2.isbn13
 AND p1.id > p2.id
WHERE p1.isbn13 IS NOT NULL AND p1.isbn13 != '';

-- 3. Products that still have a wrong ISBN13 (not 13 digits) - fix these manually
SELECT id, name, isbn13
FROM products
WHERE isbn13 IS NULL OR isbn13 NOT REGEXP '^[0-9]{13}$';

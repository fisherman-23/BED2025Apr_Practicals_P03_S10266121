-- SELECT Queries -----------------------------------
SELECT * FROM TableName;                          -- select all columns
SELECT Col1, Col2 FROM TableName;                 -- select specific columns
SELECT DISTINCT Col1 FROM TableName;              -- unique values
SELECT TOP 10 * FROM TableName;                    -- top 10 rows
SELECT * FROM TableName WHERE Col1 = 'Value';     -- filter with WHERE
SELECT * FROM TableName WHERE Col1 LIKE 'A%';     -- pattern matching (starts with 'A')
SELECT * FROM TableName WHERE Col2 > 10 AND Col3 = 'X';  -- multiple conditions
SELECT * FROM TableName ORDER BY Col1 ASC;         -- sort ascending
SELECT * FROM TableName ORDER BY Col1 DESC;        -- sort descending

-- Aggregations -------------------------------------
SELECT COUNT(*) FROM TableName;                     -- row count
SELECT AVG(Col1), SUM(Col2), MIN(Col3), MAX(Col3) FROM TableName;

-- Grouping -----------------------------------------
SELECT Col1, COUNT(*) FROM TableName
GROUP BY Col1
HAVING COUNT(*) > 1;                               -- filter groups

-- Joins --------------------------------------------
SELECT a.*, b.* FROM TableA a
INNER JOIN TableB b ON a.ID = b.ID;               -- inner join

SELECT a.*, b.* FROM TableA a
LEFT JOIN TableB b ON a.ID = b.ID;                -- left join

SELECT a.*, b.* FROM TableA a
RIGHT JOIN TableB b ON a.ID = b.ID;               -- right join

SELECT a.*, b.* FROM TableA a
FULL OUTER JOIN TableB b ON a.ID = b.ID;          -- full outer join

-- Data Manipulation --------------------------------
INSERT INTO TableName (Col1, Col2) VALUES ('Val1', 123);

UPDATE TableName SET Col1 = 'NewVal' WHERE Col2 = 123;

DELETE FROM TableName WHERE Col1 = 'ValToDelete';

-- Table Management ---------------------------------
CREATE TABLE TableName (
  ID INT PRIMARY KEY,
  Col1 VARCHAR(100),
  Col2 INT
);

ALTER TABLE TableName ADD NewCol DATETIME;

DROP TABLE TableName;

-- Transaction Control ------------------------------
BEGIN TRANSACTION;

-- Your SQL commands --

COMMIT;       -- save changes
-- or
ROLLBACK;     -- undo changes

-- SSMS Tips ---------------------------------------
-- Ctrl + R: toggle results pane
-- F5: execute query
-- Ctrl + M: show execution plan
-- Use /* ... */ for block comments and -- for single line

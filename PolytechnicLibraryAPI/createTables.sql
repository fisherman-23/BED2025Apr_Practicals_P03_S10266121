CREATE TABLE Users (
  user_id INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NULL,
  role VARCHAR(20) NOT NULL
    CHECK (role IN ('member','librarian'))
);

CREATE TABLE Books (
  book_id INT PRIMARY KEY IDENTITY(1,1),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  availability CHAR(1) NOT NULL
    CHECK (availability IN ('Y','N'))
);
